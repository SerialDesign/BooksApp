import { useState } from "react";
import { ActivityIndicator, FlatList, TextInput, Button } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { RootTabScreenProps } from "../../types";
import { useLazyQuery } from "@apollo/client";

import BookItem from "../../components/BookItem";
import { searchQuery } from "./queries";
import { parseBook } from "../../services/bookService";
import styles from "./styles";

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  // Typescript.. generic Type, defined that only "googleBooksSearch" or "openLibrarySearch" is allowed, not something random..
  const [provider, setProvider] = useState<BookProvider>("googleBooksSearch");

  // useQuery runs when the component Mounts
  // const { data, loading, error } = useQuery(query, {
  //   variables: { q: search },
  // });

  // useLazyQuery defines the query, but doesnt run auto. We call the function that executes the Query, which is done on the Button - onPress
  const [runQuery, { data, loading, error }] = useLazyQuery(searchQuery);

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
        renderItem={({ item }) => <BookItem book={parseBook(item, provider)} />}
      />
    </View>
  );
}
