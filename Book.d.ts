/* This file is for defining Global Types */
type Book = {
  image: string;
  title: string;
  authors: string[];
  isbn: string;
};

type BookProvider = "googleBooksSearch" | "openLibrarySearch";
