const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const redstone = require('redstone-api');
const { Socket } = require('dgram');
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let wal = [];
let port = 8080;

const Getmain = (array) => {

  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

  // Устанавливаем новую цену
  localStorage.setItem('newPrice', JSON.stringify(array));
  if(localStorage.getItem('oldPrice').length === 0){
    localStorage.setItem('oldPrice', JSON.stringify(array));
  }
  
  let newPrice = localStorage.getItem('newPrice');
  let oldPrice = localStorage.getItem('oldPrice');
  let newPriceJsons = JSON.parse(newPrice);
  let oldPriceJsons = JSON.parse(oldPrice);

  for (let i in oldPriceJsons) {
      if(newPriceJsons[i].symbol == i && oldPriceJsons[i].symbol == i && newPriceJsons[i].value >= oldPriceJsons[i].value){
        console.log('Цена '+[i]+' поднялась: ' + newPriceJsons[i].value);
        let arr = {
          name: newPriceJsons[i].symbol,
          value: newPriceJsons[i].value.toFixed(2),
          status: 1,
        }
        wal.push(arr);
      } else {
        console.log('Цена '+[i]+' упала: ' + newPriceJsons[i].value);
        let arr = {
          name: newPriceJsons[i].symbol,
          value: newPriceJsons[i].value.toFixed(2),
          status: 2,
        }
        wal.push(arr);
      }
  }
  sendWallets(wal);
  wal = []; // Обнуляем массив
  // Устанавливаем новую цену для следующего сравнения
  localStorage.setItem('oldPrice', JSON.stringify(array));
};

// endPoint отправляем на клиентскую часть
function sendWallets($events){
  io.emit('allPrice', $events);
}

// StartPoint Получаем все валюты
async function getWallets(){
  let array = await redstone.getPrice(['BTC', 'ETH', 'BNB', 'AR']);
  Getmain(array);
}

// Раз в 3 секунды обращаемся к функции с валютами
setInterval(() => {
    getWallets();
}, 3000);

server.listen(port);