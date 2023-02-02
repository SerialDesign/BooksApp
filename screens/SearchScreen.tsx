import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
} from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { gql, useQuery, useLazyQuery } from "@apollo/client";

import BookItem from "../components/BookItem";

const query = gql`
  query SearchBooks($q: String) {
    googleBooksSearch(q: $q, country: "US") {
      items {
        id
        volumeInfo {
          authors
          averageRating
          description
          imageLinks {
            thumbnail
          }
          title
          subtitle
          industryIdentifiers {
            identifier
            type
          }
        }
      }
    }
    openLibrarySearch(q: $q) {
      docs {
        author_name
        title
        cover_edition_key
        isbn
      }
    }
  }
`;

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  // Typescript.. generic Type, defined that only "googleBooksSearch" or "openLibrarySearch" is allowed, not something random..
  const [provider, setProvider] = useState<
    "googleBooksSearch" | "openLibrarySearch"
  >("googleBooksSearch");

  // useQuery runs when the component Mounts
  // const { data, loading, error } = useQuery(query, {
  //   variables: { q: search },
  // });

  // useLazyQuery defines the query, but doesnt run auto. We call the function that executes the Query, which is done on the Button - onPress
  const [runQuery, { data, loading, error }] = useLazyQuery(query);

  const parseBook = (item: any): Book => {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search..."
          style={styles.input}
        />
        <Button
          title="Search"
          onPress={() => runQuery({ variables: { q: search } })}
        />
      </View>

      <View style={styles.tabs}>
        <Text
          style={
            provider === "googleBooksSearch"
              ? { fontWeight: "bold", color: "royalblue" }
              : {}
          }
          onPress={() => setProvider("googleBooksSearch")}
        >
          Google Books
        </Text>
        <Text
          style={
            provider === "openLibrarySearch"
              ? { fontWeight: "bold", color: "royalblue" }
              : {}
          }
          onPress={() => setProvider("openLibrarySearch")}
        >
          Open Library
        </Text>
      </View>

      {loading && <ActivityIndicator />}
      {error && (
        <View>
          <Text>Error fetching Books</Text>
          <Text>{error.message}</Text>
        </View>
      )}
      <FlatList
        data={
          (provider === "googleBooksSearch"
            ? data?.googleBooksSearch?.items
            : data?.openLibrarySearch?.docs) || [] //if nothing of those two worked - simply put an empty array there
        }
        // showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <BookItem book={parseBook(item)} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gainsboro",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    alignItems: "center",
  },
});