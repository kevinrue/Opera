/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
 
import { Experiments } from './experiments.js';
 
if (Meteor.isServer) {
  describe('Experiments', () => {
    describe('methods', () => {
    	const userId = Random.id();
		let taskId;

		beforeEach(() => {
			Experiments.remove({});
			
		});

      it('can create an experiment', () => {
      	// Find the internal implementation of the experiment method so we can
        // test it in isolation
        const addExperiment = Meteor.server.method_handlers['experiments.insert'];
 
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId }; // Note: short for {userId: userId}
        const newName = 'test experiment';
 
        // Run the method with `this` set to the fake invocation
        addExperiment.apply(invocation, [newName]);
 
        // Verify that the method does what we expected
        assert.equal(Experiments.find().count(), 1);
      });
    });
  });
}
