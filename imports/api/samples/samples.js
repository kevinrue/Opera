import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Samples = new Mongo.Collection('samples');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish samples to users that are logged in
  Meteor.publish('samples', function samplesPublication() {
  	return (this.userId ? Samples.find() : []);
  })
}

Meteor.methods({
  'samples.clear'() {
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Samples.remove({});
  },

  'samples.insert'(listFields) {
    // ID , name, cellTypeTissue, geneticIntervention, condition, concentration, unit, duration, chipAntibody, notes, experimentId
    check(listFields[0], String); // id
    check(listFields[1], String); // name
    check(listFields[2], String); // cellTypeTissue
    check(listFields[3], String); // geneticIntervention
    check(listFields[4], String); // condition
    check(listFields[5], String); // concentration
    check(listFields[6], String); // unit
    check(listFields[7], String); // duration
    check(listFields[8], String); // chipAntibody
    check(listFields[9], String); // notes
    check(listFields[10], String); // experimentId
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let newValues = {
      id: listFields[0],
      name: listFields[1],
      cellTypeTissue: listFields[2],
      geneticIntervention: listFields[3],
      condition: listFields[4],
      concentration: listFields[5],
      unit: listFields[6],
      duration: listFields[7],
      chipAntibody: listFields[8],
      notes: listFields[9],
      experimentId: listFields[10],
    };

    let recordId = Samples.insert(
      newValues,
      (err, res) => {
        // console.log('samples.insert connection: ' + this.connection);
        if (!err){
          console.log('samples.insert: success');
          // On success, log the event
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

});