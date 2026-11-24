import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

const CODE_SECONDS = 60;
const PINK = '#F4B6E6';
const PINK_DARK = '#7A2A6B';

type BottomTab = 'home' | 'calendar' | 'scan' | 'appointments' | 'account';

const BOTTOM_TABS: { key: BottomTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'home', label: 'Home', icon: 'home-outline' },
  { key: 'calendar', label: 'Calendar', icon: 'calendar-outline' },
  { key: 'scan', label: 'Scan', icon: 'scan-outline' },
  { key: 'appointments', label: 'Appointments', icon: 'checkbox-outline' },
  { key: 'account', label: 'Account', icon: 'person-outline' },
];


function makeSession() {
  const id = Math.floor(1000 + Math.random() * 9000);
  return { sessionId: `SID-SDN${id}`, token: `${Date.now()}-${id}` };
}

export default function App() {
  const [tab, setTab] = useState<'scan' | 'code'>('code');
  const [bottomTab, setBottomTab] = useState<BottomTab>('scan');
  const [session, setSession] = useState(makeSession());
  const [secondsLeft, setSecondsLeft] = useState(0);

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
        <View style={styles.body}>
          <View style={styles.header}>
            <Pressable style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={22} color="#111" />
            </Pressable>
            <Text style={styles.title}>My Identity</Text>
            <Pressable style={[styles.iconBtn, styles.infoBtn]}>
              <Ionicons name="information-circle-outline" size={20} color="#111" />
            </Pressable>
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
            <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
              <View style={styles.meetup}>
                <Ionicons name="calendar" size={20} color="#E8D3BC" style={{ marginRight: 10 }} />
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
                    <Ionicons name="lock-closed-outline" size={26} color="#111" />
                    <Text style={styles.overlayTitle}>Code expired</Text>
                    <Pressable style={styles.refreshBtn} onPress={regenerate}>
                      <Text style={styles.refreshText}>Tap to refresh</Text>
                    </Pressable>
                  </View>
                )}
              </View>

              <View style={styles.badge}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#1F7A45" />
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
                <Ionicons name="refresh" size={16} color="#111" style={{ marginRight: 8 }} />
                <Text style={styles.regenText}>Regenerate Code</Text>
              </Pressable>
            </ScrollView>
          )}
        </View>

        <View style={styles.bottomBar}>
          {BOTTOM_TABS.map((t) => {
            const active = bottomTab === t.key;
            return (
              <Pressable
                key={t.key}
                style={styles.bottomItem}
                onPress={() => setBottomTab(t.key)}
              >
                <Ionicons
                  name={t.icon}
                  size={22}
                  color={active ? PINK_DARK : '#777'}
                />
                <Text style={[styles.bottomLabel, active && { color: PINK_DARK, fontWeight: '600' }]}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEE', alignItems: 'center' },
  phone: { flex: 1, width: '100%', maxWidth: 420, backgroundColor: '#fff' },
  body: { flex: 1, padding: 16 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  infoBtn: { borderRadius: 18, borderWidth: 1, borderColor: '#ddd' },
  title: { fontSize: 18, fontWeight: '600' },

  tabs: { flexDirection: 'row', backgroundColor: '#F3F3F3', borderRadius: 14, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: PINK },
  tabText: { color: '#333' },
  tabTextActive: { color: PINK_DARK, fontWeight: '600' },

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
  overlayTitle: { fontSize: 16, fontWeight: '600', marginVertical: 8 },
  refreshBtn: { backgroundColor: PINK, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 28 },
  refreshText: { fontWeight: '600' },

  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: '#DFF3E6', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 16 },
  badgeText: { color: '#1F7A45', fontSize: 12, marginLeft: 6 },

  card: { backgroundColor: '#F6F6F6', borderRadius: 14, padding: 14, marginBottom: 12 },
  cardTitle: { fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { color: '#777', fontSize: 12 },
  value: { fontWeight: '500' },
  timer: { fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },

  regen: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: '#ddd' },
  regenText: { fontWeight: '600' },

  bottomBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff', paddingTop: 8, paddingBottom: 12 },
  bottomItem: { flex: 1, alignItems: 'center' },
  bottomLabel: { fontSize: 10, color: '#777', marginTop: 2 },
});