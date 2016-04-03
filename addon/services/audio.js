import Ember from 'ember';

export default Ember.Service.extend({
  /**
  * The base Howler Object: Allows you to change global settings
  * https://github.com/goldfire/howler.js/tree/2.0#global-core-methods
  **/
  Howler,


  /**
   * The base Howl object: Has no use to the consuming app, exists here for testing purposes
   */
  Howl,

  /**
  * Array of strings (names of sounds) that acts as a registry for sound instances
  **/
  sounds: Ember.A(),

  /**
  * Instantiate a "sound" and place on this service by name
  *
  * @param {string}           name  The name that you will use to refer to the sound
  * @param {array || string}  src   path, as a string, or an array of strings, to the sound's mp3 file(s). Can be URLs or base64 data URIs. https://github.com/goldfire/howler.js/tree/2.0#src-array--required
  * @param {object}           opts  An optional POJO that accepts Howler options https://github.com/goldfire/howler.js/tree/2.0#more-playback-options
  * @return {object}                A Howler "Howl" object instance
  **/
  load(name, src, opts={}) {
    const Howl = this.get('Howl');

    if (Ember.isArray(src)) {
      opts.src = src;
    } else {
      opts.src = [src];
    }

    this.set(name, new Howl(opts));
    this.get('sounds').pushObject(name);
    return this.get(name);
  },

  /**
   * unload - Removes a sound from this service by "name" and unloads it from Howler
   *
   * @param  {string} name The name of the sound you would like to unload
   */
  unload(name) {
    this.get(name).unload();
    this.set(name, null);
    this.get('sounds').removeObject(name);
  },

  /**
   * pan - Pans a sound left or right
   *
   * @param  {type} name  The name of the sound you would like to pan
   * @param  {int} value  The direction and amount between -1 (hard left) and 1 (hard right)
   * @return {object}     The Howler "Howl" object instance
   */
  pan(name, value) {
    this.get(name).pos(value);
    return this.get(name);
  }
});
