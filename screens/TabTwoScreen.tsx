import { FlatList, StyleSheet } from "react-native";
import BookItem from "../components/BookItem";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

import { useMyBooks } from "../context/MyBooksProvider";

export default function TabTwoScreen() {
  // const { test } = useMyBooks(); // custom context hook instead of useContext
  // console.log(test);
  const { savedBooks } = useMyBooks();

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screerns/TabTwoScreen.tsx" /> */}
      <FlatList
        data={savedBooks}
        renderItem={({ item }) => <BookItem book={item} />} // can simply pass the item, because it is already parsed. in MyBooksProvider -> const [savedBooks, setSavedBooks] = useState<Book[]>([]);
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
});
