import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const ExperimentTypes = new Mongo.Collection('experiment-types');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish experiments to users that are logged in
  Meteor.publish('experiment-types', () => {
  	return (ExperimentTypes.find());
  })
}

Meteor.methods({
  'experimentTypes.insert'(label) {
    check(label, String);
    // TODO: check that user is an admin
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let newExperimentType = {
      label: label,
      value: label,
    };
 
    ExperimentTypes.insert(
      newExperimentType,
      // (err, res) => {
      //   // console.log('insertPairedEnd connection: ' + this.connection);
      //   if (!err){
      //     Meteor.call(
      //       'databaseEvents.insert',
      //       this.userId,
      //       'c', // 'create'
      //       Array(res),
      //       'experiment-types',
      //       newExperimentType: newExperimentType,
      //     );
      //   }
      // }
    );
  },

  // 'experimentTypes.remove'(identifier) {
  //   check(identifier, String);
 
  //   ExperimentTypes.remove(identifier);
  // },
});
