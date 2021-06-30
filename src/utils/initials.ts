const initials = (name: string) => {
  const names = name.split(' ');
  let iarr = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    iarr += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return iarr;
};

export default initials;
