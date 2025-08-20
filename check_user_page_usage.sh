#!/bin/bash

echo "=== user-page 큰 컴포넌트들 사용 현황 ==="
echo ""

# 큰 컴포넌트들만 확인
components=(
  "EnhancedShiftCriteriaForm"
  "CompensationAnalysis" 
  "CareerTimeline"
  "RadarAnalytics"
  "NurseShiftCalendar"
  "UserProfileCard"
  "NurseShiftScheduler"
)

for component in "${components[@]}"; do
    usage_files=$(find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*$component" 2>/dev/null)
    usage_count=$(echo "$usage_files" | grep -c . 2>/dev/null || echo "0")
    
    if [ "$usage_count" -eq 0 ]; then
        echo "❌ UNUSED: $component"
    else
        echo "✅ USED ($usage_count): $component"
        echo "$usage_files" | sed 's/^/   └── /'
    fi
    echo ""
done