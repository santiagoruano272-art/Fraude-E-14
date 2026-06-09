import React, { useEffect, useState } from 'react';
import { StyleSheet,Text,View,FlatList,TouchableOpacity,SafeAreaView,Alert,ActivityIndicator,} from 'react-native';
import { createClient } from '@supabase/supabase-js';

// Haz un cambio mínimo, por ejemplo agrega un comentario en App.js

const SUPABASE_URL = 'https://zbsoelgujjfpkvajdwnl.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpic29lbGd1ampmcGt2YWpkd25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MzYxMTAsImV4cCI6MjA5NjQxMjExMH0.dkfWxGAPkCSuglYGbVfb1nxJcqQVexZPMuh-GtOB-RU';

// Cliente Supabase creado directamente en App.js (sin archivo separado)
// Igual que la app de referencia — sin opciones extra de auth
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ══════════════════════════════════════════════
//   COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════
export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── FASE 2.2: Consumo de datos reales desde Supabase ──────────────────────
  // Hace un JOIN entre e14_forms y polling_tables para obtener en una sola
  // consulta los votos de cada formulario junto con la capacidad de la mesa
  const fetchE14Data = async () => {
    setLoading(true);
    try {
      const { data: forms, error } = await supabase
        .from('e14_forms')
        .select(`
          candidate_a_votes,
          candidate_b_votes,
          blank_votes,
          null_votes,
          polling_tables (table_number, registered_voters)
        `);

      if (error) throw error;
      setData(forms || []);
    } catch (error) {
      console.error('Error cargando datos de auditoría:', error.message);
      Alert.alert('🔴 SYSTEM ERROR', 'No se pudo conectar con la API de Supabase.');
    } finally {
      setLoading(false);
    }
  };

  // Carga los datos automáticamente al abrir la app
  useEffect(() => {
    fetchE14Data();
  }, []);

  // ── FASE 2.3: Botón del Pánico — RUN FORENSIC AUDIT ──────────────────────
  // Recorre todas las mesas cargadas, aplica la lógica de auditoría
  // y muestra una alerta con el resultado forense
  const runForensicAudit = () => {
    let fraudCount = 0;

    data.forEach((item) => {
      const totalVotes =
        item.candidate_a_votes +
        item.candidate_b_votes +
        item.blank_votes +
        item.null_votes;
      const maxVoters = item.polling_tables?.registered_voters || 0;
      if (totalVotes > maxVoters) {
        fraudCount++;
      }
    });

    if (fraudCount > 0) {
      Alert.alert(
        '🚨 CRITICAL SECURITY THREAT 🚨',
        `AUDITORÍA COMPLETADA:\nSe han detectado ${fraudCount} mesa(s) con alteración de datos.\n(Votos > Capacidad Física)\n\nEl preconteo ha sido CONGELADO.`
      );
    } else {
      Alert.alert(
        '🛡️ SYSTEM SECURE',
        'Auditoría completada.\nNo se hallaron inconsistencias en las mesas reportadas.'
      );
    }
  };

  // ── FASE 2.1: Renderizado estilo consola Linux ────────────────────────────
  // Cada fila de la FlatList muestra los datos de una mesa en formato terminal
  const renderTableItem = ({ item }) => {
    const totalVotes =
      item.candidate_a_votes +
      item.candidate_b_votes +
      item.blank_votes +
      item.null_votes;
    const maxVoters = item.polling_tables?.registered_voters || 0;
    const isFraudulent = totalVotes > maxVoters;

    return (
      <View style={[styles.terminalCard, isFraudulent && styles.terminalCardFraud]}>
        <Text style={styles.cyberText}>
          [NODE_ID]: DATA_STREAM_MESA_{item.polling_tables?.table_number}
        </Text>
        <Text style={styles.cyberText}>
          TOTAL VOTOS REGISTRADOS: {totalVotes}
        </Text>
        <Text style={styles.cyberText}>
          CAPACIDAD MÁXIMA LEGAL:  {maxVoters}
        </Text>
        <View style={styles.statusContainer}>
          <Text style={styles.cyberText}>INTEGRITY_STATUS: </Text>
          <Text
            style={[
              styles.statusText,
              isFraudulent ? styles.statusFraud : styles.statusSuccess,
            ]}
          >
            {isFraudulent ? '❌ CRITICAL_OVERFLOW' : '✅ VALID_DATA'}
          </Text>
        </View>
      </View>
    );
  };

  // ── RENDER PRINCIPAL ──────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.terminalContainer}>

      {/* Cabecera estilo terminal */}
      <View style={styles.header}>
        <Text style={styles.terminalTitle}>=== E-14 FORENSIC MONITOR ===</Text>
        <Text style={styles.terminalSubTitle}>
          REGISTRADURÍA NATIONAL API — SECURE CONSOLE
        </Text>
      </View>

      {/* Separador */}
      <View style={styles.divider} />

      {/* Contenido: spinner de carga o lista de mesas */}
      {loading && data.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00FF00" />
          <Text style={styles.loadingText}>FETCHING DATA FROM CLOUD_SERVER...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTableItem}
          contentContainerStyle={styles.listPadding}
          refreshing={loading}
          onRefresh={fetchE14Data}     // Pull-to-refresh para recargar datos
        />
      )}

      {/* Botón del Pánico */}
      <TouchableOpacity
        style={styles.panicButton}
        onPress={runForensicAudit}
        activeOpacity={0.7}
      >
        <Text style={styles.panicButtonText}>[ RUN FORENSIC AUDIT ]</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// ══════════════════════════════════════════════
//   ESTILOS — TEMA TERMINAL LINUX (FASE 2.1)
// ══════════════════════════════════════════════
const styles = StyleSheet.create({
  // Fondo negro total, simula pantalla de consola
  terminalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  // Título principal en verde neón
  terminalTitle: {
    color: '#00FF00',
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  // Subtítulo en verde más oscuro
  terminalSubTitle: {
    color: '#00AA00',
    fontSize: 11,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginTop: 4,
  },
  // Línea divisora punteada en verde
  divider: {
    borderBottomColor: '#00FF00',
    borderBottomWidth: 1,
    marginVertical: 15,
    marginHorizontal: 20,
    borderStyle: 'dashed',
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Tarjeta de mesa limpia: borde verde oscuro
  terminalCard: {
    borderWidth: 1,
    borderColor: '#00AA00',
    padding: 15,
    marginBottom: 12,
    backgroundColor: '#020202',
  },
  // Tarjeta de mesa con fraude: borde rojo
  terminalCardFraud: {
    borderColor: '#FF0000',
    backgroundColor: '#0a0000',
  },
  // Texto general de consola en verde neón
  cyberText: {
    color: '#00FF00',
    fontFamily: 'monospace',
    fontSize: 13,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  statusText: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
  },
  statusSuccess: {
    color: '#00FF00',
  },
  // Estado de fraude en rojo con subrayado
  statusFraud: {
    color: '#FF0000',
    textDecorationLine: 'underline',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#00FF00',
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 10,
  },
  // Botón del Pánico: fondo negro, borde rojo
  panicButton: {
    backgroundColor: '#000000',
    borderColor: '#FF0000',
    borderWidth: 2,
    padding: 18,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 25,
  },
  panicButtonText: {
    color: '#FF0000',
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
