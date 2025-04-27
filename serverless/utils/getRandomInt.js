/**
 * Gera um número aleatório entre 0 e 999.
 *
 * @returns {number} - Número aleatório gerado.
 */
function getRandomInt() {
  return Math.floor(Math.random() * 999);
}

module.exports = {
  getRandomInt,
};
