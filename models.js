const db = require('./db.js')

module.exports = {

  signup: {
    post: function (data, callback) {
      db.Usors.create({
        username: data.username,
        key: data.firebase_id,
        email: data.email,
        first: data.first,
        last: data.last,
        quote: data.quote,
        icon: data.icon
      }).then(user => {
        //console.log('new user', user)
        console.log('data.firebase_id', data.firebase_id)
        callback(undefined,data);
      }).catch(function(err) {
        callback(err);
        console.log('DB signup error ====== ', err);
      })
    }
  },

  login: {
    post: function (data, callback) {
      db.Usors.findAll({
        where: { key: data.firebase_id }
      }).then(user => {
        console.log('found user', user)
        callback(undefined, user);
      }).catch(function (err) {
        console.log('DB login error ====== ', err);
        callback(err);
        
      })
    }
  },

  addUser: {
    post: function (data, callback) {
      console.log(' requested user', data.requested)
      console.log(' models data ',data.requestee.username)
      db.Usors.findOne({
        where: {
          username: data.username
        }
      })
      .then(user =>{
        db.Friends.create({
          ogUsor: data.requestee.username,   // your username
          friend: data.requested   //  the friend you want
        })
        callback(undefined, 'success');
      }).catch(function (err){
        callback(err)
      })
    }
  },

  getgetPrivateChatHistory: {
    post: function(data, callback) {
      let history = {messages: []};
      db.Messages.findAll({
        where: {
          ogUsor: data.ogUsor,
          friend: data.friend
        }
      }).then(message => {
        history.messages.push(message);
        callback(undefined, history);
      }).catch(function (err) {
        console.log('DB login error ====== ', err);
        callback(err);
      })
    }
  },

  getRoomChatHistory: {
    post: function(data, callback) {
      let history = {messages: []};
      db.Rooms.findAll({
        where: {
          name: data.roomName
        }
      }).then(message => {
        history.messages.push(message);
        callback(undefined, history);
      }).catch(function (err) {
        console.log('DB login error ====== ', err);
        callback(err);
      })
    }
    },

  getFriends: {
    post: function (data, callback) {
      console.log(' show friends for ', data.user.username)
      db.Friends.findAll({
        where: {
          ogUsor: data.user.username
        }
      }).then(function(friends){
        var friendsArr = [];
        friends.forEach(function(friend){
          console.log('his friends are ', friend.dataValues.friend)  
          friendsArr.push(friend.dataValues.friend)        
        })
        callback(undefined, friendsArr);
      }).catch(function(err){
        callback(err)
      })
    }

  }
}