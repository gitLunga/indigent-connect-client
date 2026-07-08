// screens/Client/ProfileScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, clientAPI } from '../../services/api';
import { useToast } from '../../components/ToastProvider';
import {
    IoPersonOutline,
    IoMailOutline,
    IoShieldCheckmarkOutline,
    IoCheckmarkCircle,
    IoPhonePortraitOutline,
    IoDocumentsOutline,
    IoReceiptOutline,
    IoCardOutline,
    IoCashOutline,
    IoHomeOutline,
    IoCloudUploadOutline,
    IoClose,
    IoCalendarOutline,
    IoChevronDown,
    IoCreateOutline,
    IoInformationCircleOutline,
    IoSaveOutline,
    IoCloseCircleOutline,
    IoCallOutline,
    IoLocationOutline,
    IoBriefcaseOutline,
} from 'react-icons/io5';

const C = {
    navy:       '#0F1F3D',
    accent:     '#1E4FD8',
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
    rose:       '#DC2626',
    roseSoft:   '#FEE2E2',
};

const TITLES = [
    { value: 'Mr',   label: 'Mr'   },
    { value: 'Mrs',  label: 'Mrs'  },
    { value: 'Ms',   label: 'Ms'   },
    { value: 'Dr',   label: 'Dr'   },
    { value: 'Prof', label: 'Prof' },
    { value: 'Adv',  label: 'Adv'  },
    { value: 'Mag',  label: 'Mag'  },
];

const PROVIDERS = [
    { value: 'MTN',     label: 'MTN'     },
    { value: 'Vodacom', label: 'Vodacom' },
    { value: 'Cell_C',  label: 'Cell C'  },
    { value: 'Telkom',  label: 'Telkom'  },
    { value: 'Rain',    label: 'Rain'    },
];

const DURATIONS = [
    { value: '12', label: '12 Months' },
    { value: '24', label: '24 Months' },
    { value: '36', label: '36 Months' },
];

const DOCS = [
    { id: 'invoice',   key: 'invoice_file',         title: 'Service Invoice',      subtitle: 'Current mobile service invoice', icon: IoReceiptOutline,   required: true  },
    { id: 'id',        key: 'id_document',           title: 'ID Document',          subtitle: 'Clear copy of ID or Passport',   icon: IoCardOutline,      required: true  },
    { id: 'payslip',   key: 'payslip_document',      title: 'Latest Payslip',       subtitle: 'Most recent payslip',            icon: IoCashOutline,      required: true  },
    { id: 'residence', key: 'residence_document',    title: 'Proof of Residence',   subtitle: 'Utility bill or bank statement', icon: IoHomeOutline,      required: false },
];

const SelectField = ({ label, value, placeholder, options, onSelect, disabled }) => (
    <div style={sf.wrap}>
        <div style={sf.label}>{label}</div>
        <select style={sf.select} value={value} onChange={(e) => onSelect(e.target.value)} disabled={disabled}>
            <option value="" disabled>{placeholder}</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

const sf = {
    wrap:   { marginBottom: 16 },
    label:  { fontSize: 11, fontWeight: '700', color: C.muted, letterSpacing: '0.8px', marginBottom: 8 },
    select: { width: '100%', padding: '12px 14px', fontSize: 14, color: C.text, backgroundColor: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 12, outline: 'none', cursor: 'pointer' },
};

export default function ProfileScreen() {
    const toast    = useToast();
    const navigate = useNavigate();

    const [user,        setUser]        = useState(null);
    const [loading,     setLoading]     = useState(false);
    const [profileDone, setProfileDone] = useState(false);

    // Profile completion (initial setup)
    const [provider,   setProvider]   = useState('');
    const [duration,   setDuration]   = useState('');
    const [files,      setFiles]      = useState({});
    const [previews,   setPreviews]   = useState({});
    const fileRefs = useRef({});

    // Edit-my-details mode
    const [editMode,    setEditMode]    = useState(false);
    const [editForm,    setEditForm]    = useState({});
    const [editLoading, setEditLoading] = useState(false);

    // Load profile from API (falls back to localStorage while loading)
    useEffect(() => {
        const ud = localStorage.getItem('user');
        if (!ud) { navigate('/login'); return; }
        const local = JSON.parse(ud);
        setUser(local);
        if (local.network_provider) setProvider(local.network_provider);
        if (local.contract_duration_months) setDuration(String(local.contract_duration_months));
        const done = local.registration_status === 'Verified' || local.registration_status === 'Profile_Completed' || !!(local.network_provider && local.contract_duration_months);
        setProfileDone(done);

        // Refresh from server
        clientAPI.getProfile()
            .then(res => {
                const fresh = res.data?.data || res.data;
                if (!fresh) return;
                const merged = { ...local, ...fresh };
                setUser(merged);
                localStorage.setItem('user', JSON.stringify(merged));
                const freshDone = merged.registration_status === 'Verified' || merged.registration_status === 'Profile_Completed' || !!(merged.network_provider && merged.contract_duration_months);
                setProfileDone(freshDone);
                if (merged.network_provider)         setProvider(merged.network_provider);
                if (merged.contract_duration_months) setDuration(String(merged.contract_duration_months));
            })
            .catch(() => {/* non-fatal — stale localStorage data is fine */});
    }, []);

    const openEdit = () => {
        setEditForm({
            title:        user?.title        || '',
            first_name:   user?.first_name   || '',
            last_name:    user?.last_name    || '',
            phone_number: user?.phone_number || '',
        });
        setEditMode(true);
    };

    const cancelEdit = () => setEditMode(false);

    const saveEdit = async () => {
        if (!editForm.first_name?.trim() || !editForm.last_name?.trim()) {
            toast.warning('Missing Fields', 'First name and last name are required.');
            return;
        }
        setEditLoading(true);
        try {
            const res = await clientAPI.updateProfile(editForm);
            const updated = res.data?.data || res.data;
            if (updated) {
                const merged = { ...user, ...updated };
                setUser(merged);
                localStorage.setItem('user', JSON.stringify(merged));
            }
            setEditMode(false);
            toast.success('Profile Updated', 'Your details have been saved.');
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to save changes.';
            toast.error('Update Failed', msg);
        } finally {
            setEditLoading(false);
        }
    };

    // Profile completion handlers
    const handleFileSelect = (key, file) => {
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) { toast.error('File Too Large', 'Maximum file size is 10MB.'); return; }
        setFiles(prev => ({ ...prev, [key]: file }));
        toast.success(`${DOCS.find(d => d.key === key)?.title || 'File'} selected`);
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreviews(prev => ({ ...prev, [key]: e.target.result }));
            reader.readAsDataURL(file);
        } else {
            setPreviews(prev => ({ ...prev, [key]: 'pdf' }));
        }
    };

    const removeFile = (key) => {
        setFiles(prev => { const n = { ...prev }; delete n[key]; return n; });
        setPreviews(prev => { const n = { ...prev }; delete n[key]; return n; });
    };

    const handleSubmit = async () => {
        if (!provider) { toast.warning('Missing Field', 'Please select a network provider.'); return; }
        if (!duration) { toast.warning('Missing Field', 'Please select a contract duration.'); return; }
        for (const doc of DOCS.filter(d => d.required)) {
            if (!files[doc.key]) { toast.warning('Missing Document', `${doc.title} is required.`); return; }
        }

        setLoading(true);
        try {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + parseInt(duration, 10));

            const result = await authAPI.completeProfile(currentUser.client_user_id, {
                network_provider:         provider,
                contract_duration_months: parseInt(duration, 10),
                contract_end_date:        endDate.toISOString().split('T')[0],
                invoice_file:             files.invoice_file       || null,
                id_document:              files.id_document        || null,
                payslip_document:         files.payslip_document   || null,
                residence_document:       files.residence_document || null,
            });

            if (result.success) {
                const updatedUser = {
                    ...currentUser,
                    registration_status:      'Profile_Completed',
                    network_provider:         provider,
                    contract_duration_months: parseInt(duration, 10),
                    ...(result.data?.user || {}),
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setProfileDone(true);
                toast.success('Profile Completed!', result.message || 'You can now browse available devices.');
            } else {
                toast.error('Failed', result.message || 'Profile completion failed. Please try again.');
            }
        } catch (err) {
            const status = err.response?.status;
            const msg    = err.response?.data?.message;
            if (!err.response)      toast.error('Connection Error', 'Cannot connect to server.');
            else if (status === 409) toast.warning('Already Submitted', msg || 'Profile has already been submitted.');
            else if (status === 422) toast.error('Invalid Data', msg || 'Please check your documents and try again.');
            else                     toast.error('Failed', msg || err.message || 'Profile completion failed.');
        } finally {
            setLoading(false);
        }
    };

    const avatarInitial = user ? (user.first_name?.[0] || user.email?.[0] || 'U').toUpperCase() : 'U';

    return (
        <div style={S.root}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Page header */}
            <div style={S.header}>
                <div style={S.headerLeft}>
                    <div style={S.headerIcon}><IoPersonOutline size={20} color="rgba(255,255,255,0.9)" /></div>
                    <div>
                        <h1 style={S.headerTitle}>My Profile</h1>
                        <p style={S.headerSub}>Account information and profile settings</p>
                    </div>
                </div>
            </div>

            <div style={S.body}>
                {/* ── Account Info Card ── */}
                <section>
                    <div style={S.sectionHeader}>
                        <h2 style={S.sectionTitle}>Account Information</h2>
                        {!editMode && (
                            <button style={S.editBtn} onClick={openEdit}>
                                <IoCreateOutline size={14} color={C.accent} />
                                <span style={S.editBtnText}>Edit Details</span>
                            </button>
                        )}
                    </div>

                    <div style={S.accountCard}>
                        {/* Avatar row */}
                        <div style={S.avatarRow}>
                            <div style={S.avatar}>
                                <span style={S.avatarText}>{avatarInitial}</span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                {editMode ? (
                                    <div style={S.editNameRow}>
                                        <select style={S.editSelect} value={editForm.title || ''}
                                            onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}>
                                            <option value="">Title</option>
                                            {TITLES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                        <input style={S.editInput} placeholder="First name" value={editForm.first_name}
                                            onChange={e => setEditForm(p => ({ ...p, first_name: e.target.value }))} />
                                        <input style={S.editInput} placeholder="Last name" value={editForm.last_name}
                                            onChange={e => setEditForm(p => ({ ...p, last_name: e.target.value }))} />
                                    </div>
                                ) : (
                                    <div style={S.accountName}>{user?.title} {user?.first_name} {user?.last_name}</div>
                                )}
                                <div style={S.accountEmail}>{user?.email}</div>
                                <div style={{
                                    ...S.statusBadge,
                                    backgroundColor: user?.registration_status === 'Verified' ? C.greenSoft : C.amberSoft,
                                    color: user?.registration_status === 'Verified' ? C.green : C.amber,
                                }}>
                                    {(user?.registration_status || 'Pending').replace('_', ' ')}
                                </div>
                            </div>
                        </div>

                        {/* Editable phone field shown in edit mode */}
                        {editMode && (
                            <div style={S.editPhoneRow}>
                                <div style={S.infoIco}><IoCallOutline size={15} color={C.muted} /></div>
                                <div style={S.infoLabel}>Phone Number</div>
                                <input style={{ ...S.editInput, flex: 1 }} placeholder="e.g. 071 234 5678" value={editForm.phone_number}
                                    onChange={e => setEditForm(p => ({ ...p, phone_number: e.target.value }))} />
                            </div>
                        )}

                        {/* Info rows */}
                        <div style={S.infoGrid}>
                            {[
                                { label: 'Email Address',     value: user?.email || '—',                 icon: IoMailOutline        },
                                { label: 'Phone Number',      value: user?.phone_number || 'Not set',    icon: IoCallOutline        },
                                { label: 'User Type',         value: user?.user_type || '—',             icon: IoBriefcaseOutline   },
                                { label: 'PERSAL ID',         value: user?.persal_id || '—',             icon: IoCardOutline        },
                                { label: 'Region',            value: user?.region || '—',                icon: IoLocationOutline    },
                                { label: 'Account Status',    value: (user?.registration_status || '—').replace('_', ' '), icon: IoShieldCheckmarkOutline },
                                { label: 'Network Provider',  value: user?.network_provider || 'Not set', icon: IoPhonePortraitOutline },
                                { label: 'Contract Duration', value: user?.contract_duration_months ? `${user.contract_duration_months} Months` : 'Not set', icon: IoCalendarOutline },
                            ].map((row, i) => {
                                const Icon = row.icon;
                                return (
                                    <div key={i} style={S.infoRow}>
                                        <div style={S.infoIco}><Icon size={15} color={C.muted} /></div>
                                        <div style={S.infoLabel}>{row.label}</div>
                                        <div style={S.infoVal}>{row.value}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Edit action buttons */}
                        {editMode && (
                            <div style={S.editActions}>
                                <button style={S.cancelBtn} onClick={cancelEdit} disabled={editLoading}>
                                    <IoCloseCircleOutline size={16} color={C.muted} />
                                    <span>Cancel</span>
                                </button>
                                <button style={{ ...S.saveBtn, ...(editLoading ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}
                                    onClick={saveEdit} disabled={editLoading}>
                                    {editLoading ? (
                                        <><div style={S.spinner} /><span>Saving…</span></>
                                    ) : (
                                        <><IoSaveOutline size={16} color="#fff" /><span>Save Changes</span></>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Profile Completion Form ── */}
                {!profileDone && (
                    <section>
                        <div style={S.sectionHeader}>
                            <h2 style={S.sectionTitle}>Complete Your Profile</h2>
                            <div style={S.requiredBadge}>Required to apply for devices</div>
                        </div>

                        <div style={S.infoBanner}>
                            <IoInformationCircleOutline size={16} color={C.accent} />
                            <span style={S.infoBannerText}>
                                Upload the required documents and select your preferences below.
                                Your profile will be reviewed before you can apply for devices.
                            </span>
                        </div>

                        <div style={S.formCard}>
                            <div style={S.formRow}>
                                <div style={{ flex: 1 }}>
                                    <SelectField label="NETWORK PROVIDER" value={provider} placeholder="Select provider" options={PROVIDERS} onSelect={setProvider} disabled={loading} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <SelectField label="CONTRACT DURATION" value={duration} placeholder="Select duration" options={DURATIONS} onSelect={setDuration} disabled={loading} />
                                </div>
                            </div>

                            <div style={S.docsLabel}>DOCUMENTS</div>
                            <div style={S.docsGrid}>
                                {DOCS.map(doc => {
                                    const Icon = doc.icon;
                                    const hasFile = !!files[doc.key];
                                    const preview = previews[doc.key];
                                    return (
                                        <div key={doc.id} style={{ ...S.docCard, ...(hasFile ? S.docCardDone : {}) }}>
                                            <div style={S.docTop}>
                                                <div style={{ ...S.docIco, backgroundColor: hasFile ? C.greenSoft : C.accentSoft }}>
                                                    <Icon size={18} color={hasFile ? C.green : C.accent} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={S.docTitle}>{doc.title}</div>
                                                    <div style={S.docSub}>{doc.subtitle}</div>
                                                </div>
                                                {doc.required && !hasFile && <div style={S.docRequired}>Required</div>}
                                                {hasFile && <div style={S.docCheck}><IoCheckmarkCircle size={18} color={C.green} /></div>}
                                            </div>

                                            {hasFile ? (
                                                <div style={S.docFileRow}>
                                                    <div style={S.docFileName}>
                                                        {preview === 'pdf' ? '📄' : '🖼️'} {files[doc.key].name}
                                                    </div>
                                                    <button style={S.docRemove} onClick={() => removeFile(doc.key)}>
                                                        <IoClose size={14} color={C.rose} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <input type="file"
                                                        ref={el => { fileRefs.current[doc.key] = el; }}
                                                        style={{ display: 'none' }}
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        onChange={e => handleFileSelect(doc.key, e.target.files[0])}
                                                    />
                                                    <button style={S.uploadBtn} onClick={() => fileRefs.current[doc.key]?.click()} disabled={loading}>
                                                        <IoCloudUploadOutline size={15} color={C.accent} />
                                                        <span style={S.uploadBtnText}>Upload</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <button style={{ ...S.submitBtn, ...(loading ? S.submitBtnLoading : {}) }} onClick={handleSubmit} disabled={loading}>
                                {loading ? (
                                    <><div style={S.spinner} /><span>Submitting…</span></>
                                ) : (
                                    <><IoCheckmarkCircle size={18} color="#fff" /><span>Submit Profile</span></>
                                )}
                            </button>
                        </div>
                    </section>
                )}

                {/* Profile completed state */}
                {profileDone && (
                    <section>
                        <div style={S.completedCard}>
                            <div style={S.completedIco}><IoCheckmarkCircle size={36} color={C.green} /></div>
                            <div style={S.completedTitle}>Profile Submitted</div>
                            <div style={S.completedSub}>
                                Your profile has been submitted and is under review. You'll be notified when your
                                eligibility is confirmed.
                            </div>
                            <button style={S.completedBtn} onClick={() => navigate('/device-catalog')}>
                                Browse Devices
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

const S = {
    root: { backgroundColor: '#F0F4FA', display: 'flex', flexDirection: 'column', minHeight: '100%' },

    header: {
        background: 'linear-gradient(135deg, #0A1628 0%, #0F1F3D 100%)',
        padding: '0 28px', minHeight: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 2px 16px rgba(10,22,40,0.4)',
    },
    headerLeft:  { display: 'flex', alignItems: 'center', gap: 14 },
    headerIcon:  { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.14)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '-0.2px' },
    headerSub:   { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 },

    body: { flex: 1, padding: '24px 28px 48px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, width: '100%', alignSelf: 'center', boxSizing: 'border-box' },

    sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
    sectionTitle:  { fontSize: 15, fontWeight: '800', color: C.text, margin: 0 },
    requiredBadge: { backgroundColor: C.amberSoft, color: C.amber, fontSize: 11, fontWeight: '700', padding: '4px 10px', borderRadius: 20 },

    editBtn:     { display: 'flex', alignItems: 'center', gap: 6, backgroundColor: C.accentSoft, border: `1px solid ${C.accent}40`, borderRadius: 10, padding: '6px 14px', cursor: 'pointer' },
    editBtnText: { fontSize: 13, fontWeight: '700', color: C.accent },

    // Account card
    accountCard: { backgroundColor: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 2px 10px rgba(15,31,61,0.06)' },
    avatarRow:   { display: 'flex', alignItems: 'flex-start', gap: 18, padding: '24px 24px 20px', borderBottom: `1px solid ${C.border}`, background: 'linear-gradient(135deg, #F8FAFF 0%, #EBF0FF 100%)' },
    avatar:      { width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #1E4FD8 0%, #3B82F6 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(30,79,216,0.35)' },
    avatarText:  { fontSize: 24, fontWeight: '900', color: '#fff' },
    accountName: { fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 3, letterSpacing: '-0.2px' },
    accountEmail:{ fontSize: 13, color: C.muted, marginBottom: 8 },
    statusBadge: { display: 'inline-block', fontSize: 11, fontWeight: '700', padding: '4px 12px', borderRadius: 20 },

    editNameRow: { display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
    editSelect:  { padding: '8px 10px', fontSize: 13, color: C.text, backgroundColor: C.surface, border: `1.5px solid ${C.accent}`, borderRadius: 9, outline: 'none', width: 80, cursor: 'pointer' },
    editInput:   { padding: '8px 12px', fontSize: 13, color: C.text, backgroundColor: C.surface, border: `1.5px solid ${C.accent}`, borderRadius: 9, outline: 'none', minWidth: 0, flex: 1 },

    editPhoneRow: { display: 'flex', alignItems: 'center', padding: '14px 24px', borderBottom: `1px solid ${C.border}`, gap: 12, backgroundColor: `${C.accent}05` },

    infoGrid:  { display: 'flex', flexDirection: 'column' },
    infoRow:   { display: 'flex', alignItems: 'center', padding: '13px 24px', borderBottom: `1px solid ${C.border}`, gap: 12 },
    infoIco:   { width: 30, display: 'flex', justifyContent: 'center', flexShrink: 0 },
    infoLabel: { fontSize: 13, color: C.muted, width: 170, flexShrink: 0 },
    infoVal:   { fontSize: 13, fontWeight: '600', color: C.text, flex: 1 },

    editActions: { display: 'flex', gap: 10, padding: '16px 24px', justifyContent: 'flex-end', backgroundColor: `${C.accent}05`, borderTop: `1px solid ${C.border}` },
    cancelBtn:   { display: 'flex', alignItems: 'center', gap: 6, backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: '9px 18px', cursor: 'pointer', fontSize: 13, fontWeight: '700', color: C.muted },
    saveBtn:     { display: 'flex', alignItems: 'center', gap: 6, backgroundColor: C.navy, border: 'none', borderRadius: 10, padding: '9px 22px', cursor: 'pointer', fontSize: 13, fontWeight: '700', color: '#fff', boxShadow: '0 3px 10px rgba(15,31,61,0.25)' },

    infoBanner:     { display: 'flex', alignItems: 'flex-start', gap: 10, backgroundColor: C.accentSoft, border: `1px solid ${C.accent}30`, borderRadius: 12, padding: '12px 14px', marginBottom: 14 },
    infoBannerText: { fontSize: 13, color: '#1E3A8A', lineHeight: 1.6 },

    formCard: { backgroundColor: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: '20px' },
    formRow:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 4 },

    docsLabel: { fontSize: 11, fontWeight: '700', color: C.muted, letterSpacing: '0.8px', marginBottom: 10 },
    docsGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginBottom: 20 },
    docCard:   { backgroundColor: C.bg, borderRadius: 12, padding: 14, border: `1.5px solid ${C.border}` },
    docCardDone:{ borderColor: `${C.green}60`, backgroundColor: C.greenSoft + '50' },
    docTop:    { display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
    docIco:    { width: 36, height: 36, borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    docTitle:  { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 2 },
    docSub:    { fontSize: 11, color: C.muted },
    docRequired:{ fontSize: 10, fontWeight: '700', color: C.amber, backgroundColor: C.amberSoft, padding: '2px 7px', borderRadius: 10, flexShrink: 0 },
    docCheck:  { flexShrink: 0 },
    docFileRow:{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: C.surface, borderRadius: 8, padding: '6px 10px', border: `1px solid ${C.border}` },
    docFileName:{ fontSize: 12, color: C.text, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    docRemove: { background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 },
    uploadBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '9px 0', backgroundColor: C.accentSoft, border: `1px solid ${C.accent}40`, borderRadius: 9, cursor: 'pointer' },
    uploadBtnText:{ fontSize: 13, fontWeight: '700', color: C.accent },

    submitBtn:       { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, width: '100%', backgroundColor: C.navy, padding: '14px 0', borderRadius: 12, border: 'none', color: '#fff', fontWeight: '700', fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 12px rgba(15,31,61,0.25)' },
    submitBtnLoading:{ opacity: 0.6, cursor: 'not-allowed' },
    spinner:         { width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },

    completedCard: { backgroundColor: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
    completedIco:  { width: 68, height: 68, borderRadius: 20, backgroundColor: C.greenSoft, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
    completedTitle:{ fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 8 },
    completedSub:  { fontSize: 14, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 400 },
    completedBtn:  { backgroundColor: C.navy, padding: '12px 24px', borderRadius: 12, border: 'none', color: '#fff', fontWeight: '700', fontSize: 14, cursor: 'pointer' },
};
