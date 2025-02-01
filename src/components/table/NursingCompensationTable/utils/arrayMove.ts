function arrayMove<T>(arr: T[], oldIndex: number, newIndex: number): T[] {
  const newArr = [...arr];
  const [movedItem] = newArr.splice(oldIndex, 1);
  newArr.splice(newIndex, 0, movedItem);
  return newArr;
}

export default arrayMove;
