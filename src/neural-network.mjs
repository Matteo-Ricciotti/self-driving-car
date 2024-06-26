import Level from './level.mjs';
import { lerp } from './utils.mjs';

class NeuralNetwork {
  /**
   * @param {Array<number>} neuronCounts
   */
  constructor(neuronCounts) {
    this.levels = [];

    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  /**
   * @param {Array<any>} givenInputs
   * @param {NeuralNetwork} network
   */
  static feedForward = (givenInputs, network) => {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);

    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }

    return outputs;
  };

  /**
   * @param {NeuralNetwork} network
   * @param {number} amount
   */
  static mutate = (network, amount = 1) => {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }

      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(level.weights[i][j], Math.random() * 2 - 1, amount);
        }
      }
    });
  };
}

export default NeuralNetwork;
