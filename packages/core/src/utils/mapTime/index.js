const fn = (createdAt) => {
  const t = createdAt.toDate();
  return `${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${t.getMinutes()}`;
};

export default fn;
