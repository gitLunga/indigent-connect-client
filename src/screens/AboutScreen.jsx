// screens/AboutScreen.jsx
// Describes the IndigentConnect platform in detail.
// Shares the AuthNavbar with Welcome/Login/Register screens.

import React from 'react';
import AuthNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import {
    IoHomeOutline,
    IoCheckmarkCircleOutline,
    IoAnalyticsOutline,
    IoShieldCheckmarkOutline,
    IoPeopleOutline,
    IoDocumentTextOutline,
    IoGlobeOutline,
    IoTimeOutline,
    IoCloudUploadOutline,
    IoLockClosedOutline,
    IoNotificationsOutline,
    IoServerOutline,
} from 'react-icons/io5';

const C = {
    navy:       '#ef0c0c',
    accent:     '#af2323',
    accentSoft: '#EBF0FF',
    surface:    '#FFFFFF',
    bg:         '#F4F6FA',
    border:     '#E2E8F2',
    text:       '#0F1F3D',
    muted:      '#64748B',
    mutedLight: '#94A3B8',
    green:      '#059669',
    greenSoft:  '#D1FAE5',
    amber:      '#D97706',
    amberSoft:  '#FEF3C7',
    purple:     '#7C3AED',
    purpleSoft: '#EDE9FE',
};

const FEATURES = [
    { icon: IoHomeOutline,            color: C.accent,  bg: C.accentSoft,  title: 'Indigent Registration', desc: 'Households can register an account and submit a formal subsidy application directly through the platform, eliminating paperwork and manual processes.' },
    { icon: IoCheckmarkCircleOutline, color: C.green,   bg: C.greenSoft,   title: 'Means-Test Approval',   desc: 'Applications flow through a structured intake review and means-test assessment workflow, ensuring compliance at every step.' },
    { icon: IoAnalyticsOutline,       color: C.purple,  bg: C.purpleSoft,  title: 'Real-time Tracking',    desc: 'Applicants receive live status updates throughout the process — from submission to approval or rejection — with full visibility into where their application stands.' },
    { icon: IoShieldCheckmarkOutline, color: C.amber,   bg: C.amberSoft,   title: 'Secure & Compliant',    desc: 'Built on enterprise-grade security principles with role-based access control, encrypted data handling, and full audit trails to meet government compliance requirements.' },
    { icon: IoCloudUploadOutline,     color: '#0891B2', bg: '#E0F7FA',     title: 'Document Management',   desc: 'Required supporting documentation — ID, proof of income, proof of residence — can be uploaded directly to the platform for review by assessment officers.' },
    { icon: IoNotificationsOutline,   color: '#DC2626', bg: '#FEE2E2',     title: 'Instant Notifications', desc: 'Users receive automatic notifications when their application status changes, keeping them informed without needing to manually check the system.' },
];

const PROCESS_STEPS = [
    { num: '01', title: 'Register & Verify',       desc: 'Applicants create an account using their South African ID number. Accounts are held for review before profile completion.' },
    { num: '02', title: 'Complete Your Profile',   desc: 'Applicants upload supporting documents — ID, proof of income, and optionally proof of residence or an affidavit — for verification.' },
    { num: '03', title: 'Account Verification',    desc: 'Municipal staff review the uploaded documents and verify the applicant\'s account before an application can be submitted.' },
    { num: '04', title: 'Submit Application',      desc: 'Once verified, applicants submit a formal indigent registration application, which enters the review queue.' },
    { num: '05', title: 'Intake & Assessment',     desc: 'The application is reviewed by an Intake Clerk for completeness, then assessed by an Assessment Officer through a means test.' },
    { num: '06', title: 'Decision & Enrollment',   desc: 'Once a final decision is made (approved or rejected), the applicant is notified immediately. Approved applicants are enrolled for subsidized services.' },
];

const WHO_USES = [
    { icon: IoPeopleOutline,       color: C.accent,  bg: C.accentSoft, title: 'Indigent Households',   desc: 'Residents unable to afford municipal services who register and apply for subsidized rates.' },
    { icon: IoDocumentTextOutline, color: C.green,   bg: C.greenSoft,  title: 'Intake & Assessment Officers', desc: 'Municipal staff who review application completeness and conduct the means-test assessment.' },
    { icon: IoServerOutline,       color: C.purple,  bg: C.purpleSoft, title: 'Admin & Supervisors',   desc: 'Internal teams responsible for oversight, reporting, and managing the registration system.' },
];

const STATS = [
    { value: '9',      label: 'Provinces Covered' },
    { value: '100%',   label: 'Digital Process' },
    { value: '24/7',   label: 'Platform Access' },
    { value: 'Secure', label: 'Gov-grade Security' },
];

export default function AboutScreen() {
    return (
        <div style={S.root}>
            <AuthNavbar />
            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
                .about-fade { animation: fadeUp 0.45s ease both; }
            `}</style>

            {/* ── Hero section ── */}
            <section style={S.hero}>
                <div style={S.heroRing1} />
                <div style={S.heroRing2} />
                <div style={S.heroContent}>
                    <div style={S.heroEmblemWrap}>
                        <div style={S.heroGlow} />
                        <div style={S.heroEmblem}><IoHomeOutline size={44} color={C.accent} /></div>
                    </div>
                    <h1 style={S.heroTitle}>About IndigentConnect</h1>
                    <p style={S.heroSub}>
                        The digital indigent registration platform for<br />
                        South African municipalities
                    </p>

                    {/* Stats row */}
                    <div style={S.statsRow}>
                        {STATS.map((s, i) => (
                            <div key={i} style={S.statCard}>
                                <div style={S.statValue}>{s.value}</div>
                                <div style={S.statLabel}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── What is it ── */}
            <section style={S.section}>
                <div style={S.sectionInner}>
                    <div style={S.badge}>OVERVIEW</div>
                    <h2 style={S.sectionTitle}>What is IndigentConnect?</h2>
                    <p style={S.bodyText}>
                        IndigentConnect is a centralised digital platform designed to modernise and streamline the indigent
                        registration process for South African municipalities, enabling households to apply for subsidized
                        water, electricity, sanitation and refuse services.
                    </p>
                    <p style={S.bodyText}>
                        Traditionally, indigent registration involved extensive paperwork, manual routing between departments,
                        and significant delays in decision-making. IndigentConnect replaces this process entirely with a
                        secure, transparent, and efficient digital workflow — accessible from any web browser.
                    </p>
                    <p style={S.bodyText}>
                        From submission to decision, every step is tracked in real time. Applicants always know exactly where
                        their application stands, while intake clerks and assessment officers have full visibility into
                        pending items, documentation, and compliance requirements.
                    </p>

                    {/* Highlight cards */}
                    <div style={S.highlightGrid}>
                        {[
                            { icon: IoTimeOutline,       color: C.amber,  bg: C.amberSoft,  text: 'Reduces registration time from weeks to days' },
                            { icon: IoDocumentTextOutline,color: C.accent, bg: C.accentSoft, text: 'Fully paperless — all documents are digital' },
                            { icon: IoLockClosedOutline,  color: C.green,  bg: C.greenSoft,  text: 'Secure role-based access for all user types' },
                            { icon: IoGlobeOutline,       color: C.purple, bg: C.purpleSoft, text: 'Accessible nationwide from any modern browser' },
                        ].map((h, i) => (
                            <div key={i} style={S.highlightCard}>
                                <div style={{ ...S.highlightIco, backgroundColor: h.bg }}>
                                    <h.icon size={18} color={h.color} />
                                </div>
                                <p style={S.highlightText}>{h.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section style={{ ...S.section, backgroundColor: C.bg }}>
                <div style={S.sectionInner}>
                    <div style={S.badge}>FEATURES</div>
                    <h2 style={S.sectionTitle}>Platform Capabilities</h2>
                    <p style={S.bodySub}>Everything you need to register, track, and manage your indigent application — in one place.</p>
                    <div style={S.featureGrid}>
                        {FEATURES.map((f, i) => (
                            <div key={i} style={S.featureCard}>
                                <div style={{ ...S.featureIco, backgroundColor: f.bg }}>
                                    <f.icon size={22} color={f.color} />
                                </div>
                                <h3 style={S.featureTitle}>{f.title}</h3>
                                <p style={S.featureDesc}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section style={S.section}>
                <div style={S.sectionInner}>
                    <div style={S.badge}>PROCESS</div>
                    <h2 style={S.sectionTitle}>How It Works</h2>
                    <p style={S.bodySub}>A simple six-step process from registration to service enrollment.</p>
                    <div style={S.processGrid}>
                        {PROCESS_STEPS.map((step, i) => (
                            <div key={i} style={S.processCard}>
                                <div style={S.processNum}>{step.num}</div>
                                <h3 style={S.processTitle}>{step.title}</h3>
                                <p style={S.processDesc}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Who uses it ── */}
            <section style={{ ...S.section, backgroundColor: C.bg }}>
                <div style={S.sectionInner}>
                    <div style={S.badge}>USERS</div>
                    <h2 style={S.sectionTitle}>Who Uses IndigentConnect?</h2>
                    <p style={S.bodySub}>The platform serves different roles within the municipal indigent registration process.</p>
                    <div style={S.whoGrid}>
                        {WHO_USES.map((w, i) => (
                            <div key={i} style={S.whoCard}>
                                <div style={{ ...S.whoIco, backgroundColor: w.bg }}>
                                    <w.icon size={26} color={w.color} />
                                </div>
                                <h3 style={S.whoTitle}>{w.title}</h3>
                                <p style={S.whoDesc}>{w.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Legal & Compliance ── */}
            <section style={S.section}>
                <div style={S.sectionInner}>
                    <div style={S.badge}>COMPLIANCE</div>
                    <h2 style={S.sectionTitle}>Legal &amp; Regulatory Framework</h2>
                    <p style={S.bodyText}>
                        IndigentConnect operates in accordance with South African municipal governance regulations,
                        including the Municipal Systems Act, each municipality's Indigent Policy, and the
                        Protection of Personal Information Act (POPIA).
                    </p>
                    <p style={S.bodyText}>
                        All applicant data is handled with strict confidentiality. Means-test outcomes are reviewed
                        against each municipality's indigent policy thresholds, and every decision is logged with a
                        full audit trail for accountability and appeal purposes.
                    </p>
                    <div style={S.complianceGrid}>
                        {['Municipal Systems Act', 'POPIA Aligned', 'Indigent Policy Framework', 'MFMA Aligned', 'Audit Trail', 'Role-based Access'].map((tag, i) => (
                            <div key={i} style={S.complianceTag}>{tag}</div>
                        ))}
                    </div>
                </div>
            </section>


            <PublicFooter />
        </div>
    );
}

const S = {
    root: { minHeight: '100vh', backgroundColor: C.surface, display: 'flex', flexDirection: 'column' },

    // Hero
    hero: {
        backgroundColor: C.navy, position: 'relative', overflow: 'hidden',
        padding: '80px 24px 60px', display: 'flex', justifyContent: 'center',
    },
    heroRing1: { position: 'absolute', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', top: -180, right: -120 },
    heroRing2: { position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)', bottom: -80, left: -80 },
    heroContent: { maxWidth: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' },
    heroEmblemWrap: { position: 'relative', marginBottom: 32 },
    heroGlow: { position: 'absolute', inset: -24, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
    heroEmblem: { width: 108, height: 108, borderRadius: 24, backgroundColor: '#fff', border: '2px solid rgba(255,255,255,0.25)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', boxShadow: '0 12px 40px rgba(0,0,0,0.3)', overflow: 'hidden' },
    heroTitle: { fontSize: 36, fontWeight: '900', color: '#fff', textAlign: 'center', margin: '0 0 12px', letterSpacing: '-0.5px' },
    heroSub:   { fontSize: 16, color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 1.6, marginBottom: 36 },
    statsRow:  { display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', width: '100%' },
    statCard:  { flex: '1 1 120px', maxWidth: 160, backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 12px', textAlign: 'center' },
    statValue: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
    statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '600', letterSpacing: 0.4 },

    // Sections
    section:     { padding: '64px 0' },
    sectionInner:{ maxWidth: '100%', margin: '0 auto', padding: '0 24px' },
    badge: {
        display: 'inline-block', fontSize: 10, fontWeight: '800',
        letterSpacing: '1.5px', color: C.accent,
        backgroundColor: C.accentSoft, padding: '4px 12px', borderRadius: 20,
        marginBottom: 16,
    },
    sectionTitle: { fontSize: 30, fontWeight: '900', color: C.text, margin: '0 0 20px', letterSpacing: '-0.3px' },
    bodyText:     { fontSize: 15, color: C.muted, lineHeight: 1.75, marginBottom: 20, maxWidth: '100%' },
    bodySub:      { fontSize: 15, color: C.muted, lineHeight: 1.6, marginBottom: 36, maxWidth: '100%' },

    // Highlights
    highlightGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginTop: 8 },
    highlightCard: { display: 'flex', alignItems: 'flex-start', gap: 12, backgroundColor: C.bg, borderRadius: 14, padding: 16, border: `1px solid ${C.border}` },
    highlightIco:  { width: 36, height: 36, borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    highlightText: { fontSize: 13, color: C.text, fontWeight: '600', lineHeight: 1.5, margin: 0 },

    // Feature cards
    featureGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
    featureCard:  { backgroundColor: C.surface, borderRadius: 18, padding: '24px 22px', border: `1px solid ${C.border}`, boxShadow: '0 2px 10px rgba(15,31,61,0.05)' },
    featureIco:   { width: 50, height: 50, borderRadius: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    featureTitle: { fontSize: 17, fontWeight: '800', color: C.text, marginBottom: 8, marginTop: 0 },
    featureDesc:  { fontSize: 13, color: C.muted, lineHeight: 1.65, margin: 0 },

    // Process
    processGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
    processCard: { backgroundColor: C.bg, borderRadius: 16, padding: '22px 20px', border: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' },
    processNum:  { fontSize: 40, fontWeight: '900', color: `${C.accent}18`, lineHeight: 1, marginBottom: 8, letterSpacing: '-1px' },
    processTitle:{ fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 8, marginTop: 0 },
    processDesc: { fontSize: 13, color: C.muted, lineHeight: 1.65, margin: 0 },

    // Who uses
    whoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 },
    whoCard: { backgroundColor: C.surface, borderRadius: 18, padding: '28px 24px', border: `1px solid ${C.border}`, textAlign: 'center', boxShadow: '0 2px 10px rgba(15,31,61,0.05)' },
    whoIco:  { width: 64, height: 64, borderRadius: 18, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' },
    whoTitle:{ fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 10, marginTop: 0 },
    whoDesc: { fontSize: 13, color: C.muted, lineHeight: 1.65, margin: 0 },

    // Compliance tags
    complianceGrid: { display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 },
    complianceTag:  { backgroundColor: C.accentSoft, color: C.accent, padding: '7px 16px', borderRadius: 20, fontSize: 12, fontWeight: '700', border: `1px solid ${C.accent}30` },


};