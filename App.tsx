import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const CODE_SECONDS = 60;

function makeSession() {
  const id = Math.floor(1000 + Math.random() * 9000);
  return { sessionId: `SID-SDN${id}`, token: `${Date.now()}-${id}` };
}

export default function App() {
  const [tab, setTab] = useState<'scan' | 'code'>('code');
  const [session, setSession] = useState(makeSession());
  const [secondsLeft, setSecondsLeft] = useState(0); // starts expired, like the mockup

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const expired = secondsLeft <= 0;

  const regenerate = () => {
    setSession(makeSession());
    setSecondsLeft(CODE_SECONDS);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.phone}>
        <View style={styles.header}>
          <Text style={styles.back}>{'<'}</Text>
          <Text style={styles.title}>My Identity</Text>
          <View style={styles.infoBtn}>
            <Text>i</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, tab === 'scan' && styles.tabActive]}
            onPress={() => setTab('scan')}
          >
            <Text style={tab === 'scan' ? styles.tabTextActive : styles.tabText}>
              Scan Code
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, tab === 'code' && styles.tabActive]}
            onPress={() => setTab('code')}
          >
            <Text style={tab === 'code' ? styles.tabTextActive : styles.tabText}>
              My Code
            </Text>
          </Pressable>
        </View>

        {tab === 'scan' ? (
          <View style={styles.center}>
            <Text style={styles.muted}>Camera scanner goes here</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            <View style={styles.meetup}>
              <View style={{ flex: 1 }}>
                <Text style={styles.meetupLabel}>NEXT MEETUP</Text>
                <Text style={styles.meetupText}>Thu, 5 Nov · 18:00 · Navigli</Text>
              </View>
              <View style={styles.confirmed}>
                <Text style={styles.confirmedText}>CONFIRMED</Text>
              </View>
            </View>

            <View style={styles.qrWrap}>
              <View style={{ opacity: expired ? 0.12 : 1 }}>
                <QRCode value={session.token} size={200} />
              </View>

              {expired && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayTitle}>Code expired</Text>
                  <Pressable style={styles.refreshBtn} onPress={regenerate}>
                    <Text style={styles.refreshText}>Tap to refresh</Text>
                  </Pressable>
                </View>
              )}
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>Screenshot protected</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>TIME OUT</Text>
                <Text style={[styles.timer, expired && { color: '#D64545' }]}>
                  {mm}:{ss}
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Verification details</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Holder</Text>
                <Text style={styles.value}>Alex Morgan</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Session ID</Text>
                <Text style={styles.value}>{session.sessionId}</Text>
              </View>
            </View>

            <Pressable style={styles.regen} onPress={regenerate}>
              <Text style={styles.regenText}>Regenerate Code</Text>
            </Pressable>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const PINK = '#F4B6E6';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEE', alignItems: 'center' },
  phone: { flex: 1, width: '100%', maxWidth: 420, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  back: { fontSize: 20, width: 32 },
  title: { fontSize: 18, fontWeight: '600' },
  infoBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: '#F3F3F3', borderRadius: 14, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: PINK },
  tabText: { color: '#333' },
  tabTextActive: { color: '#7A2A6B', fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: '#888' },
  meetup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#8B5A2B', borderRadius: 14, padding: 14, marginBottom: 20 },
  meetupLabel: { color: '#E8D3BC', fontSize: 11, letterSpacing: 1 },
  meetupText: { color: '#fff', fontWeight: '600', marginTop: 2 },
  confirmed: { backgroundColor: '#2E7D4F', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  confirmedText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  qrWrap: { alignSelf: 'center', width: 240, height: 240, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  overlayTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  refreshBtn: { backgroundColor: PINK, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 28 },
  refreshText: { fontWeight: '600' },
  badge: { alignSelf: 'center', backgroundColor: '#DFF3E6', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 16 },
  badgeText: { color: '#1F7A45', fontSize: 12 },
  card: { backgroundColor: '#F6F6F6', borderRadius: 14, padding: 14, marginBottom: 12 },
  cardTitle: { fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { color: '#777', fontSize: 12 },
  value: { fontWeight: '500' },
  timer: { fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },
  regen: { alignItems: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: '#ddd' },
  regenText: { fontWeight: '600' },
});