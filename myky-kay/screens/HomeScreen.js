import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomHeader from '../components/CustomHeader';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        console.log('Fetched products:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.itemImage} 
          resizeMode='contain' 
          onError={(error) => console.log('Failed to load image:', error.nativeEvent.error)}
        />
        <Text style={styles.itemText}>{item.title}</Text>
        <Text style={[styles.itemText, styles.itemPrice]}>${item.price}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
        <Image 
          source={require('../assets/add_circle.png')} 
          style={{ width: 20, height: 20 }}  
          resizeMode='contain' 
        />
      </TouchableOpacity>
    </View>
  );
  

  const addToCart = async (product) => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      const cartItems = cart ? JSON.parse(cart) : [];
      const updatedCartItems = [...cartItems, product];
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader />
      <Text style={styles.ourStoreText}>Our Store</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        numColumns={2}
        contentContainerStyle={styles.productContainer}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    color: '#fff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productContainer: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  item: {
    width: (screenWidth / 2) - 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: 200,
    marginBottom: 8,
  },
  itemText: {
    textAlign: 'center',
    marginTop: 5,
  },
  itemPrice: {
    color: 'orange',
  },
  addToCartButton: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
  },
  ourStoreText: {
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 10,
    fontSize: 20,
  },
});

export default HomeScreen;
