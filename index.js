import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as GlobalStyles from '../../Global/GlobalStyles';
import * as GlobalAppInfo from '../../Global/AppInfo';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Ionicons'
import { postData } from '../../Global/Functions';
import { width } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';
import con from '../Sql/sql'
const Sql = new con;



export default function MenuPage({ navigation }) {
  const [menucat, setmenuCat] = useState([]);
  const [menuList, setmenuList] = useState([]);
  const [selectedMenuList, setSelectedMenuList] = useState([])
  const [selectedCatId, setSelectedCatId] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0);
  const [refresh, setRefresh] = useState(false)


  useEffect(() => {
    menuCatItems();
    menuListItems();
  }, []);


  const topRef = React.useRef();
  const bottomRef = React.useRef();


  const SPACING = 4;

  // const scrollToActiveIndex = index => {
  //   setActiveIndex(index);
  //   bottomRef?.current?.scrollToOffset({
  //     offset: index * width,
  //     animated: true,
  //   });
  // }
  // if (width / 2) {
  //   topRef?.current?.scrollToOffset({
  //     offset: index * width / 2,
  //     animated: true,
  //   });
  // } else {
  //   topRef?.current?.scrollToOffset({
  //     offset: 0,
  //     animated: true,
  //   });
  // }

  const menuCatItems = async () => {
    const API = `${GlobalAppInfo.App.apiPath}item_categories.php`;
    postData(API).then(resjson1 => {
      setmenuCat(resjson1.products);
      setSelectedCatId(resjson1.products[0].itm_id)
    });
  };
  const menuListItems = async () => {
    const API = `${GlobalAppInfo.App.apiPath}item_categories.php?categories=0`;
    // console.log(API)
    postData(API).then(resjson2 => {
      // console.log(resjson2.items)
      setmenuList(resjson2.items);
      setSelectedMenuList([resjson2.items[0]])

    });
  };
  const getItemForCatId = ({ catId }) => {
    let myDisplayItem = []
    // console.log(menuList.length);
    menuList.map(item => {
      if (item.item_cat == catId) {
        myDisplayItem.push(item);
      }
    })
    setSelectedMenuList(myDisplayItem);
  }

  const Increment = (id) => {

    // Sql.consolete()
    let temp = selectedMenuList
    temp.map(item => {
      if (item.itm_code == id) {
        item.qty = parseFloat(item.qty) + 1
      }
    })
    setRefresh(!refresh)
  }

  const Decrement = (id) => {
    let temp = selectedMenuList
    temp.map(item => {
      if (item.itm_code == id) {
        item.qty = parseFloat(item.qty) - 1
      }
    })
    setRefresh(!refresh)
  }
  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>
        <LinearGradient colors={['#01a0fe', '#2ec091']} style={styles.naveBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="angle-double-left" size={30} color="#000" />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              fontSize: 17,
              fontWeight: 'bold',
              color: GlobalStyles.Color.black,
              flex: 1,
              textAlign: 'center',
            }}>
            CATEGORIES FOR TABLE
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon1 name="cart" size={30} color='#000000' />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient colors={['#01a0fe', '#2ec091']} >
          <FlatList
            ref={topRef}
            data={menucat}
            refreshing={refresh}
            horizontal
            pagingEnabled
            // showsHorizontalScrollIndicator={}
            // onMomentumScrollEnd={ev => {
            //   scrollToActiveIndex(
            //     Math.floor(ev.nativeEvent.contentOffset.x / width),
            //   );
            // }}
            keyExtractor={item => item.itm_id}
            renderItem={({ item, index }) => (
              <View style={{ flex: 1 }}  >
                <TouchableOpacity
                  style={{ height: 45, padding: 10 }}
                  onPress={() => {
                    getItemForCatId({ catId: item.itm_id })
                    setSelectedCatId(item.itm_id)
                    setRefresh(!refresh)
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'left',
                      fontSize: 17,
                      fontWeight: 'bold',
                      color: selectedCatId == item.itm_id ? 'red' : GlobalStyles.Color.black,
                    }}>
                    {item.item_cat}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </LinearGradient>
        <FlatList
          ref={bottomRef}
          data={selectedMenuList}
          refreshing={refresh}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.itm_code}
          renderItem={({ item, index }) => {
            return <View style={{ flex: 0.5, padding: 10 }}>
              <View
                style={{
                  height: 65,
                  //elevation: 0.2,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  borderRadius: 9,
                  width: '100%',
                  borderWidth: 1,
                  backgroundColor: GlobalStyles.Color.UIColor_LITE
                }}>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'left',
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginLeft: 10,
                    color: GlobalStyles.Color.black,
                  }}>
                  {item.item}
                </Text>
                {item.qty > 0 ?
                  <View style={{ flexDirection: 'row', marginLeft: 300, marginBottom: 24 }}>
                    <TouchableOpacity style={{ marginRight: 4, backgroundColor: GlobalStyles.Color.black, width: 15, borderRadius: 6 }} onPress={() => Decrement(item.itm_code)}>
                      <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#FFFFFF' }}>-</Text>
                    </TouchableOpacity>
                    <Text style={{ color: '#000000' }}>{item.qty}</Text>
                    <TouchableOpacity style={{ marginLeft: 5, backgroundColor: GlobalStyles.Color.black, width: 15, borderRadius: 6 }} onPress={() => Increment(item.itm_code)} >
                      <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#FFFFFF' }}>+</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <TouchableOpacity style={{ marginLeft: 300, marginBottom: 24, backgroundColor: GlobalStyles.Color.accept, width: 50, borderRadius: 2, elevation: 1 }} onPress={() => Increment(item.itm_code)}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: GlobalStyles.Color.white }}>ADD</Text>
                  </TouchableOpacity>
                }
              </View>
            </View>
          }}
        />

      </View >

    </SafeAreaView >
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.Color.new_Color,
  },
  naveBar: {
    backgroundColor: GlobalStyles.Color.red,
    width: '100%',
    height: GlobalStyles.windowWidthPercentage(15),
    shadowColor: GlobalStyles.Color.black,
    borderColor: GlobalStyles.Color.black,
    elevation: 50,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: '5%',
    justifyContent: 'space-evenly',
  },
});
