import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const SeqbookLog = new Mongo.Collection('seqbookLog');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish experiments to users that are logged in
  // TODO: restrict log events sent to client according to permissions
  Meteor.publish('seqbookLog', function sequencersPublication() {
  	return (SeqbookLog.find());
  })
}

Meteor.methods({
  'seqbookLog.insert'(userId, action, objectId, collection, newValues) {
    // console.log('seqbookLog.insert');
    // console.log('userId: ' + userId);
    // console.log('action: ' + action);
    // console.log('objectId: ' + objectId);
    // console.log('collection: ' + collection);
    // console.log('newValues: ' + newValues);
    // only the server itself is allowed to add entries in the log
    // https://github.com/themeteorchef/server-only-methods/blob/master/README.md says that:
    // (this.connection == null) when this method is called on the server
    // However, it seems to be the opposite (this.connection != null) in the server
    // console.log(this.connection);
    if (this.connection != null) {
      // console.log('server side');
      check(userId, String);
      check(action, String);
      check(objectId, String);
      check(collection, String);
      check(newValues, Object);

      if (userId !== this.userId) {
        throw new Meteor.Error('seqbookLog.insert.unauthorized',
          'userId supplied does not match this.userId');
      }
      // console.log('userId confirmed');
   
      SeqbookLog.insert({
        userId: this.userId,
        action: action,
        objectId: objectId,
        collection: collection,
        newValues: newValues,
      }, (err, res) => {
        if (err){
          // TODO: consider log rotation
          console.log(err);
        }
      });
    }
    
  },

});
