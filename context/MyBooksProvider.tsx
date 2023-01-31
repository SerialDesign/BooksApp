import { createContext, useContext } from "react";

// default value for Context
export const MyBooksContext = createContext({});

const MyBooksProvider = ({ children }) => {
  return (
    <MyBooksContext.Provider value={{ test: "a" }}>
      {children}
    </MyBooksContext.Provider>
  );
};

export const useMyBooks = () => useContext(MyBooksContext);

export default MyBooksProvider;
