import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// properly typescript rules
type MyBooksContextType = {
  onToggleSave: (book: Book) => void; // fucntion receiving a book and returns void
  isBookSaved: (book: Book) => boolean; // fucntion receiving a book and returns boolean
  savedBooks: Book[]; // simply an array of books
};

// define a context
// default value for Context
const MyBooksContext = createContext<MyBooksContextType>({
  //defining default values for type (see above)
  onToggleSave: () => {}, // = empty function, by default not doing anything when they are initialized, later on in the component the have a proper value
  isBookSaved: () => false,
  savedBooks: [],
});

// optional, because of typescript.. othersiwe param in MyBooksProvider w/ red underline, but still works
type Props = {
  children: ReactNode;
};

const MyBooksProvider = ({ children }: Props) => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []); //load the data when the component mounts, dependecy = empty array (+ check again 245)

  useEffect(() => {
    if (loaded) {
      persistData();
    }
  }, [savedBooks]);

  const areBooksTheSame = (a: Book, b: Book) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const isBookSaved = (book: Book) => {
    // checks if book is already saved - some() expects a comparator function, when at least one of this items fullfilles this condition
    return savedBooks.some(
      (savedBook) => areBooksTheSame(savedBook, book) //JSON.stringify() is needed otherwise it only checks by reference. then if a book was checked two times, it has another reference and returns falls. -> with this it compares the string values of the books
    ); // checks if book (param) is in the savedBooks array
  };

  // helper function - if setSavedBooks would be passed in value provider it would overwrite everthing, with this method it adds a book to existing list
  // replaced with toogle Save below
  //   const addBook = (book: Book) => {
  //     setSavedBooks((books) => [book, ...books]);
  //   };

  const persistData = async () => {
    //write data to the local storage
    await AsyncStorage.setItem("booksData", JSON.stringify(savedBooks)); // first Param: key = booksData, 2 param: string = savedBooks stringified
  };

  const loadData = async () => {
    //read data to the local storage
    const dataString = await AsyncStorage.getItem("booksData"); // only 1 Param: key that we want to read

    if (dataString) {
      // when you first open the app, there is nothing in the dataString
      const items = JSON.parse(dataString); // - we have to transform from a string to an array - oposite of stringify
      setSavedBooks(items);
    }

    setLoaded(true); // makes sure that the data gets loaded first and then persistData is called, otherwise the persist func might override the booksData with an empty array
  };

  const onToggleSave = (book: Book) => {
    if (isBookSaved(book)) {
      //remove from saved
      setSavedBooks((books) =>
        books.filter((savedBook) => !areBooksTheSame(savedBook, book))
      );
    } else {
      // add to saved
      setSavedBooks((books) => [book, ...books]);
    }
  };

  return (
    // wrap context provider around screens which need it
    // exports functions onToggleSave, isBookSaved of value field + data = savedBooks -> to render it on the page
    <MyBooksContext.Provider value={{ onToggleSave, isBookSaved, savedBooks }}>
      {children}
    </MyBooksContext.Provider>
  );
};

// custom hook - resolves problem that in every screen the two imports are needed (context from react + MyBooksContext)
export const useMyBooks = () => useContext(MyBooksContext);

export default MyBooksProvider;
