/* eslint-disable no-console, prefer-destructuring */
import { describe, test, expect } from 'vitest';

describe('올바른 로그인 사용자 온보딩 테스트', () => {
  
  test('1. 로그인 사용자 올바른 플로우: 실계정 ID로 온보딩', async () => {
    const uniqueEmail = `correct${Date.now()}@test.com`;
    let authCookie = '';
    
    // 🎯 Step 1: 회원가입
    const signupResponse = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'password123',
        firstName: '정',
        lastName: '간호'
      })
    });

    expect(signupResponse.ok).toBe(true);
    const signupResult = await signupResponse.json();
    const realUserId = signupResult.user?.id;
    // 실계정 생성 완료

    // 🎯 Step 2: 로그인 (쿠키 저장)
    const loginResponse = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'password123'
      })
    });

    expect(loginResponse.ok).toBe(true);
    
    // 쿠키 추출
    const setCookie = loginResponse.headers.get('set-cookie');
    if (setCookie) {
      authCookie = setCookie.split(';')[0]; // 첫 번째 쿠키만 사용
      
    }

    // 🎯 Step 3: 인증된 상태에서 온보딩 초기화
    const initResponse = await fetch('http://localhost:3000/api/onboarding/init', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': authCookie || ''
      },
      body: JSON.stringify({})
    });

    expect(initResponse.ok).toBe(true);
    const { tempUserId } = await initResponse.json();
    
    
    // 🎯 핵심 검증: 로그인 사용자는 실계정 ID 받아야 함
    expect(tempUserId).toBe(realUserId); // temp_가 아닌 실제 ID
    expect(tempUserId).not.toMatch(/^temp_/);

    // 🎯 Step 4: 실계정 ID로 BasicInfo 저장
    const basicResponse = await fetch('http://localhost:3000/api/onboarding/basic-info', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': authCookie || ''
      },
      body: JSON.stringify({
        name: '정간호',
        education: "Master's Degree",
        nursingRole: 'Nurse Practitioner (NP)',
        experienceYears: 12,
        tempUserId // 실제로는 realUserId
      })
    });

    expect(basicResponse.ok).toBe(true);
    

    // 🎯 Step 5: 진행상황 확인 (실계정 ID로 조회)
    const progressResponse = await fetch(`http://localhost:3000/api/onboarding/progress/${realUserId}`, {
      headers: { 'Cookie': authCookie || '' }
    });

    expect(progressResponse.ok).toBe(true);
    const progressData = await progressResponse.json();
    

    // 실계정에 직접 저장되었는지 확인
    expect(progressData.tempUserId).toBe(realUserId);
    expect(progressData.basicInfoCompleted).toBe(true);
    expect(progressData.accountCompleted).toBe(true); // 이미 계정 있으니까 true
  });

  test('2. 로그인 사용자 Complete: 실계정 ID 그대로 반환', async () => {
    const uniqueEmail = `complete${Date.now()}@test.com`;
    let authCookie = '';
    
    // 회원가입 + 로그인
    const signupResponse = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'password123',
        firstName: '완료',
        lastName: '테스트'
      })
    });

    const signupResult = await signupResponse.json();
    const realUserId = signupResult.user?.id;

    const loginResponse = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'password123'
      })
    });

    const setCookie = loginResponse.headers.get('set-cookie');
    if (setCookie) {
      authCookie = setCookie.split(';')[0];
    }

    // 온보딩 초기화 (실계정 ID 받기)
    const initResponse = await fetch('http://localhost:3000/api/onboarding/init', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': authCookie
      },
      body: JSON.stringify({})
    });

    const { tempUserId } = await initResponse.json();
    expect(tempUserId).toBe(realUserId); // 실계정 ID 확인

    // BasicInfo 저장
    await fetch('http://localhost:3000/api/onboarding/basic-info', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': authCookie
      },
      body: JSON.stringify({
        name: '완료테스트',
        education: "Bachelor's Degree",
        nursingRole: 'Registered Nurse (RN)',
        experienceYears: 3,
        tempUserId
      })
    });

    // 🎯 Complete 테스트 (실계정 ID 사용)
    const completeResponse = await fetch('http://localhost:3000/api/onboarding/complete', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': authCookie
      },
      body: JSON.stringify({ tempUserId })
    });

    expect(completeResponse.ok).toBe(true);
    const completeResult = await completeResponse.json();
    
    
    
    

    // 🎯 핵심 검증: 로그인 사용자는 실계정 ID 그대로 반환
    expect(completeResult.userId).toBe(realUserId);
    expect(completeResult.message).toContain('completed');
  });

  test('3. 올바른 로그인 vs 비로그인 차이점', async () => {
    // 🎯 Case 1: 비로그인 (temp ID 사용)
    const nonLoggedInit = await fetch('http://localhost:3000/api/onboarding/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    const { tempUserId: nonLoggedTempId } = await nonLoggedInit.json();
    
    expect(nonLoggedTempId).toMatch(/^temp_/); // temp_ ID

    // 🎯 Case 2: 로그인 사용자 (실계정 ID 사용)
    const uniqueEmail = `compare${Date.now()}@test.com`;
    
    // 회원가입 + 로그인
    const signupResponse = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'password123',
        firstName: '비교',
        lastName: '테스트'
      })
    });

    const signupResult = await signupResponse.json();
    const realUserId = signupResult.user?.id;

    const loginResponse = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'password123'
      })
    });

    const authCookie = loginResponse.headers.get('set-cookie')?.split(';')[0] || '';

    const loggedInit = await fetch('http://localhost:3000/api/onboarding/init', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': authCookie
      },
      body: JSON.stringify({})
    });

    const { tempUserId: loggedTempId } = await loggedInit.json();
    
    

    // 🎯 핵심 차이점: 로그인 사용자는 실계정 ID 사용
    expect(loggedTempId).toBe(realUserId);
    expect(loggedTempId).not.toMatch(/^temp_/);
    
    // 비로그인과 로그인의 명확한 차이
    expect(nonLoggedTempId).toMatch(/^temp_/);
    expect(loggedTempId).not.toMatch(/^temp_/);
  });
});