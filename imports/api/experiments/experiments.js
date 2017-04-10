import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Experiments = new Mongo.Collection('experiments');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish experiments to users that are logged in
  Meteor.publish('experiments', function experimentsPublication() {
  	return (this.userId ? Experiments.find() : []);
  })
}

Meteor.methods({
  'experiments.clear'() {
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Experiments.remove({});
  },

  'experiments.insert'(id, title, type, organism, contact, description, notes) {
    check(id, String);
    check(title, String);
    check(type, String);
    check(organism, String);
    check(contact, String);
    check(description, String);
    check(notes, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let newValues = {
      id: id,
      title: title,
      type: type,
      organism: organism,
      contact: contact,
      description: description,
      notes: notes,
    };

    let recordId = Experiments.insert(
      newValues,
      (err, res) => {
        // console.log('experiments.insert connection: ' + this.connection);
        // On success, log the event
        if (!err){
          console.log('experiments.insert: success');
          // Meteor.call(
          //   'databaseEvents.insert',
          //   this.userId,
          //   'c', // 'create'
          //   Array(res),
          //   'rawFastqs',
          //   newValues: newValues,
          // );
        }
      }
    )

    console.log('newExperimentId: ' + recordId)
 
    return(recordId);
  },

  'experiments.countRecordsWithTitle'(title) {
    check(title, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    return (
      Experiments.find(
        {
          title: title,
        }
      ).count()
    );
  },

  // 'experiments.remove'(experimentId) {
  //   check(experimentId, String);
 
  //   Experiments.remove(experimentId);
  // },

});