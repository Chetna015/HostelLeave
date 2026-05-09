'use client';

import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: '2px solid #1e293b',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: '1px solid #cbd5e1',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    fontSize: 11,
  },
  label: {
    fontWeight: 'bold',
    width: '35%',
    color: '#475569',
  },
  value: {
    width: '65%',
    color: '#1e293b',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },
  imageSection: {
    marginBottom: 20,
  },
  imageSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e293b',
  },
  image: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
    borderRadius: 4,
    border: '1px solid #cbd5e1',
  },
  signatureSection: {
    marginTop: 30,
    borderTop: '2px solid #1e293b',
    paddingTop: 20,
  },
  signatureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  signatureBox: {
    flex: 1,
    borderTop: '1px solid #1e293b',
    paddingTop: 15,
    textAlign: 'center',
  },
  wardenSignatureSection: {
    marginTop: 40,
    paddingTop: 30,
    borderTop: '3px solid #1e293b',
    textAlign: 'center',
  },
  wardenSignatureImage: {
    width: 200,
    height: 100,
    objectFit: 'contain',
    marginBottom: 15,
    marginTop: 20,
  },
  wardenSignatureLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 10,
  },
  wardenApprovedStamp: {
    marginTop: 20,
    padding: '10px 20px',
    backgroundColor: '#065f46',
    color: '#ecfdf5',
    textAlign: 'center',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 'bold',
  },
  signatureImage: {
    width: '100%',
    height: 80,
    objectFit: 'contain',
    marginBottom: 10,
    marginTop: 10,
  },
  signatureLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: '1px solid #cbd5e1',
    textAlign: 'center',
    fontSize: 9,
    color: '#64748b',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    padding: '4px 8px',
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

interface LeavePassProps {
  leaveRequest: any;
}

export const LeavePass = ({ leaveRequest }: LeavePassProps) => {
  const parentApproval = leaveRequest.approvals?.find((a: any) => a.approver.role === 'PARENT');
  const wardenApproval = leaveRequest.approvals?.find((a: any) => a.approver.role === 'WARDEN' || a.approver.role === 'ADMIN');
  const student = leaveRequest.student;

  const departureDate = new Date(leaveRequest.departureDate).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const returnDate = new Date(leaveRequest.returnDate).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>HOSTEL LEAVE PASS</Text>
          <Text style={styles.headerSubtitle}>Official Leave Authorization Document</Text>
          <Text style={styles.headerSubtitle}>Request ID: {leaveRequest.id}</Text>
        </View>

        {/* Student Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STUDENT INFORMATION</Text>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.row}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{student.fullName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Roll Number</Text>
                <Text style={styles.value}>{student.rollNumber}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Course</Text>
                <Text style={styles.value}>{student.course}</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.row}>
                <Text style={styles.label}>Hostel Room</Text>
                <Text style={styles.value}>{student.hostelRoomNumber}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Father Name</Text>
                <Text style={styles.value}>{student.fatherName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Emergency Contact</Text>
                <Text style={styles.value}>{leaveRequest.emergencyContact}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Leave Application Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LEAVE APPLICATION DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Leave Type</Text>
            <Text style={styles.value}>{leaveRequest.leaveType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Reason for Leave</Text>
            <Text style={styles.value}>{leaveRequest.reason}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Destination Address</Text>
            <Text style={styles.value}>{leaveRequest.destinationAddress}</Text>
          </View>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.row}>
                <Text style={styles.label}>Departure Date</Text>
                <Text style={styles.value}>{departureDate}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Departure Time</Text>
                <Text style={styles.value}>{leaveRequest.departureTime}</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.row}>
                <Text style={styles.label}>Return Date</Text>
                <Text style={styles.value}>{returnDate}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Transport Mode</Text>
                <Text style={styles.value}>{leaveRequest.transportMode}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Verification Images */}
        {(leaveRequest.parentSelfieUrl || leaveRequest.parentSignatureUrl) && (
          <View style={styles.imageSection}>
            <Text style={styles.imageSectionTitle}>VERIFICATION MEDIA</Text>
            <View style={styles.twoColumn}>
              {leaveRequest.parentSelfieUrl && (
                <View style={styles.column}>
                  <Text style={styles.imageSectionTitle}>Parent Selfie</Text>
                  <Image src={leaveRequest.parentSelfieUrl} style={styles.image} />
                </View>
              )}
              {leaveRequest.parentSignatureUrl && (
                <View style={styles.column}>
                  <Text style={styles.imageSectionTitle}>Parent Signature</Text>
                  <Image src={leaveRequest.parentSignatureUrl} style={styles.image} />
                </View>
              )}
            </View>
          </View>
        )}

        {/* Approval Status */}
        <View style={styles.signatureSection}>
          <Text style={styles.sectionTitle}>APPROVALS</Text>
          <View style={styles.signatureGrid}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>PARENT APPROVAL</Text>
              {leaveRequest.parentSelfieUrl && (
                <Image src={leaveRequest.parentSelfieUrl} style={styles.signatureImage} />
              )}
              <Text style={styles.badge}>✓ APPROVED</Text>
              <Text style={{ fontSize: 9, color: '#64748b', marginTop: 8 }}>
                {new Date(leaveRequest.parentVerifiedAt).toLocaleDateString('en-IN')}
              </Text>
            </View>

            {wardenApproval?.signature?.signature && (
              <View style={styles.signatureBox}>
                <Text style={styles.signatureLabel}>WARDEN/ADMIN DIGITAL SIGNATURE</Text>
                <Image src={wardenApproval.signature.signature} style={styles.signatureImage} />
                <Text style={styles.badge}>✓ {wardenApproval.status}</Text>
                <Text style={{ fontSize: 9, color: '#64748b', marginTop: 8 }}>
                  {wardenApproval.approver.adminProfile?.fullName}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Warden/Admin Digital Signature - Prominent Section */}
        {wardenApproval?.signature?.signature && (
          <View style={styles.wardenSignatureSection}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 }}>
              AUTHORIZED BY
            </Text>
            <Image src={wardenApproval.signature.signature} style={styles.wardenSignatureImage} />
            <Text style={styles.wardenSignatureLabel}>
              {wardenApproval.approver.adminProfile?.fullName || 'Hostel Warden'}
            </Text>
            <Text style={{ fontSize: 10, color: '#475569', marginTop: 5 }}>
              {wardenApproval.approver.adminProfile?.hostelName}
            </Text>
            <View style={styles.wardenApprovedStamp}>
              <Text>✓ OFFICIALLY APPROVED</Text>
              <Text style={{ fontSize: 9, marginTop: 5 }}>
                {new Date(wardenApproval.createdAt).toLocaleDateString('en-IN')}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text>This is an official hostel leave pass. Present this document at the security gate.</Text>
          <Text>Generated on {new Date().toLocaleDateString('en-IN')} | Document ID: {leaveRequest.id}</Text>
        </View>
      </Page>
    </Document>
  );
};
