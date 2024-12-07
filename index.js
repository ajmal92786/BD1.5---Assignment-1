const express = require('express');
let cors = require('cors');
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(cors());
app.use(express.static('static'));

// Server-side values
let taxRate = 5; // 5%
let discountPercentage = 10; // 10%
let loyaltyrate = 2; // Two points per $1

// Function to calculate totalCartPrice
function getTotalCartPrice(newItemPrice, cartTotal) {
  return cartTotal + newItemPrice;
}

// Endpoint 1 : Takes new item price and calculate total cart price
app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(getTotalCartPrice(newItemPrice, cartTotal).toString());
});

// Function to Apply a discount based on membership status
function getDiscountedPrice(cartTotal, isMember) {
  if (isMember) {
    return cartTotal - (cartTotal * discountPercentage) / 100;
  } else {
    return cartTotal;
  }
}

// Endpoint 2 : Apply a discount based on membership status
app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember === 'true';
  res.send(getDiscountedPrice(cartTotal, isMember).toString());
});

// Function to Calculate tax on the cart total
function calculatetax(cartTotal) {
  return (cartTotal * taxRate) / 100;
}

// Endpoint 3 : Returns the tax on the cart total
app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculatetax(cartTotal).toString());
});

// Function to calculate the delivery time based on shipping method
function getDeliveryTime(shippingMethod, distance) {
  if (shippingMethod === 'standard') {
    return Math.ceil(distance / 50);
  } else {
    return Math.ceil(distance / 100);
  }
}

// Endpoint 4 : Estimate delivery time based on shipping method
app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
  res.send(getDeliveryTime(shippingMethod, distance).toString());
});

// FUnction to calculate shipping cost based on weight and distance
function calculateShippingCost(weight, distance) {
  return weight * distance * 0.1;
}

// Endpoint 5 : Calculate the shipping cost based on weight and distance
app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  res.send(calculateShippingCost(weight, distance).toString());
});

// Function to calculate loyalty points earned from a purchase
function calculateLoyaltyPoints(purchaseAmount) {
  return purchaseAmount * loyaltyrate;
}

// Endpoint 6 : Calculate loyalty points earned from a purchase
app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  res.send(calculateLoyaltyPoints(purchaseAmount).toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
