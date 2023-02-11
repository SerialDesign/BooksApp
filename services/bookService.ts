export const parseBook = (item: any, provider: BookProvider): Book => {
  if (provider === "googleBooksSearch") {
    return {
      image: item.volumeInfo.imageLinks?.thumbnail,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      isbn: item.isbn?.[0],
    };
  }
  return {
    // image: "",
    // TODO: Fix URL, is forwared right now, which slows down image loading.. in Video 1h50min..
    image: `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}.jpg`,
    title: item.title,
    authors: item.author_name,
    isbn: item.isbn,
  };
};
