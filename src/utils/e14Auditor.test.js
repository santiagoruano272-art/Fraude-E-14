// ══════════════════════════════════════════════════════════════
//  E-14 FORENSIC ENGINE — Suite de Pruebas Jest (Fase 3)
//  Usa require (CommonJS) para compatibilidad con el contenedor
//
//  Ejecutar dentro del contenedor:
//    docker compose exec app npm test
// ══════════════════════════════════════════════════════════════

const { checkTableFraud } = require('./e14Auditor');

describe('--- ANALISIS FORENSE JEST: FORMULARIOS E-14 ---', () => {

  test('Debería marcar como FRAUDE si los votos superan la capacidad', () => {
    // Mesa con 330 votos pero solo 300 votantes registrados → FRAUDE
    const mockFraudForm = {
      candidate_a_votes: 150,
      candidate_b_votes: 120,
      blank_votes: 40,
      null_votes: 20,
      polling_tables: { registered_voters: 300 },
    };
    expect(checkTableFraud(mockFraudForm)).toBe(true);
  });

  test('Debería marcar como VALIDO si los votos respetan el limite legal', () => {
    // Mesa con 145 votos y 200 votantes registrados → VÁLIDO
    const mockCleanForm = {
      candidate_a_votes: 80,
      candidate_b_votes: 50,
      blank_votes: 10,
      null_votes: 5,
      polling_tables: { registered_voters: 200 },
    };
    expect(checkTableFraud(mockCleanForm)).toBe(false);
  });

});
