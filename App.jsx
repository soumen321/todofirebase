import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';

//import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';

const App = () => {
  const [inputText, setInputText] = useState();
  const [list, setList] = useState([]);
  const [buttonState, setButtonState] = useState(false);
  const [cartIndex, setCartIndex] = useState(false);

  const submitText = async () => {
    try {
      const index = list.length;
      const data = await database().ref(`todo/${index}`).set({
        value: inputText,
      });

      //console.log(data);

      setInputText('');
    } catch (error) {
      console.log(error);
    }
  };

  const updateText = async () => {
    try {
      const data = await database().ref(`todo/${cartIndex}`).set({
        value: inputText,
      });

      // console.log('UPdated ' + data);

      setInputText('');
      setButtonState(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deletTodoItem = index => {
    Alert.alert(
      'Todo Delete',
      'Are you sure you want to delete this item ? ',
      [
        {text: 'Yes', onPress: () => deleteItem(index)},
        {
          text: 'No',
          onPress: () => console.log('No button clicked'),
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const deleteItem = async index => {
    const data = await database().ref(`todo/${index}`).remove();
  };

  const setUpdateItem = (index, cartValue) => {
    // console.log('updateItem ' + index);
    // console.log('updateItem cartValue' + cartValue);
    // console.log('updateItem 2 ' + list[index].item.value);
    setInputText(cartValue);
    setCartIndex(index);
    setButtonState(true);
    // const data = await database().ref(`todo/${index}`).set({
    //   value: inputText,
    // });
  };

  useEffect(() => {
    getDatabase();
  }, []);

  const getDatabase = async () => {
    try {
      // const data = await firestore().collection("testing").doc("DYNzHPdYJ1NtpybqVVaw").get();
      //console.log(data._data)
      // setInputText(data._data.name)
      //const data = await database().ref('todo').once('value');

      const data = await database()
        .ref('todo')
        .on('value', tempData => {
          console.log(data);
          setList(tempData.val());
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            color: '#000',
            fontSize: 32,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          ADD TODO
        </Text>

        <TextInput
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 6,
            borderColor: '#000',
            backgroundColor: '#fff',
            borderWidth: 2,
            width: '80%',
            height: 50,
            marginHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          placeholder="Enter text"
          value={inputText}
          onChangeText={text => setInputText(text)}
        />

        {!buttonState ? (
          <TouchableOpacity
            onPress={() => submitText()}
            style={{
              marginTop: 10,
              borderRadius: 6,
              backgroundColor: 'green',
              borderColor: 'green',
              borderWidth: 2,
              width: 160,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: '#fff', fontSize: 16}}>ADD</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => updateText()}
            style={{
              marginTop: 10,
              borderRadius: 6,
              backgroundColor: 'green',
              borderColor: 'green',
              borderWidth: 2,
              width: 160,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: '#fff', fontSize: 16}}>Update</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{marginTop: 30, marginHorizontal: 10}}>
        <Text
          style={{
            color: '#000',
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
          }}>
          TODO LIST
        </Text>

        <FlatList
          data={list}
          renderItem={(data, index) => {
            console.log(data);
            if (data.item !== null) {
              return (
                <View
                  style={{
                    backgroundColor: '#fff',
                    margin: 5,
                    height: 40,
                    borderRadius: 16,
                    flex: 3,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 14,
                    }}>
                    {data.item.value}
                  </Text>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Icon
                      name="edit"
                      size={20}
                      color="green"
                      onPress={() => {
                        setUpdateItem(data.index, data.item.value);
                      }}
                    />
                    <Icon
                      name="trash"
                      size={20}
                      color="red"
                      onPress={() => deletTodoItem(data.index)}
                      style={{marginHorizontal: 10}}
                    />
                  </View>
                </View>
              );
            }
          }}
        />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3E5FC',
  },
});
