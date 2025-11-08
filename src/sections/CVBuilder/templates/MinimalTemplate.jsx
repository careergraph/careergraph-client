import { Document, Page, Text, View, Link, StyleSheet, Font } from "@react-pdf/renderer";

// Register Vietnamese-compatible font
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#111827",
    padding: 40,
  },
  header: {
    borderBottom: "1.5 solid #e0e7ff",
    paddingBottom: 16,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
  },
  headline: {
    fontSize: 11,
    color: "#4c6ef5",
    marginTop: 6,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: 500,
  },
  summary: {
    marginTop: 10,
    lineHeight: 1.6,
    fontSize: 9.5,
    color: "#374151",
  },
  infoRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
    fontSize: 9,
  },
  link: {
    color: "#4c6ef5",
    textDecoration: "none",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
    color: "#1f2667",
  },
  timeline: {
    color: "#6b7280",
    fontSize: 8.5,
  },
  experienceItem: {
    marginBottom: 10,
  },
  bullet: {
    marginLeft: 10,
    lineHeight: 1.5,
    fontSize: 9,
  },
  columns: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
  column: {
    flex: 1,
  },
  pill: {
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: "#eef2ff",
    color: "#4338ca",
    fontSize: 8.5,
    marginRight: 5,
    marginBottom: 5,
  },
});

const MinimalTemplate = ({ data }) => {
  const {
    personal = {},
    contact = {},
    experience = [],
    education = [],
    skills = [],
    languages = [],
    awards = [],
  } = data || {};

  // Ensure arrays are valid
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeLanguages = Array.isArray(languages) ? languages : [];
  const safeAwards = Array.isArray(awards) ? awards : [];
  const safeExperience = Array.isArray(experience) ? experience : [];
  const safeEducation = Array.isArray(education) ? education : [];

  const formatTimeline = (start, end) => {
    if (!start && !end) return "";
    if (start && !end) return `${start} - Hiện tại`;
    return `${start || ""} - ${end || ""}`.trim();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.name}>{personal?.fullName}</Text>
          <Text style={styles.headline}>{personal?.headline}</Text>
          {personal?.summary ? (
            <Text style={styles.summary}>{personal.summary}</Text>
          ) : null}

          <View style={styles.infoRow}>
            {contact?.email ? (
              <Link style={styles.link} src={`mailto:${contact.email}`}>
                {contact.email}
              </Link>
            ) : null}
            {contact?.phone ? <Text>{contact.phone}</Text> : null}
            {contact?.website ? (
              <Link style={styles.link} src={`https://${contact.website.replace(/^https?:\/\//, "")}`}>
                {contact.website}
              </Link>
            ) : null}
            {contact?.linkedin ? (
              <Link style={styles.link} src={`https://${contact.linkedin.replace(/^https?:\/\//, "")}`}>
                {contact.linkedin}
              </Link>
            ) : null}
          </View>
        </View>

        <View style={styles.section} wrap>
          <Text style={styles.sectionTitle}>Kinh nghiệm</Text>
          {safeExperience.map((item, index) => (
            <View key={item?.id || `exp-${index}`} style={styles.experienceItem} wrap>
              <Text style={{ fontWeight: 700 }}>{item?.role || ""}</Text>
              <Text>{item?.company || ""}</Text>
              <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
              {Array.isArray(item?.bulletPoints) && item.bulletPoints.length ? (
                <View>
                  {item.bulletPoints.map((bullet, bulletIndex) => (
                    <Text key={`${item?.id || index}-bullet-${bulletIndex}`} style={styles.bullet}>
                      • {bullet}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.columns}>
          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Học vấn</Text>
              {safeEducation.map((item, index) => (
                <View key={item?.id || `edu-${index}`} style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: 700 }}>{item?.school || ""}</Text>
                  <Text>{item?.degree || ""}</Text>
                  <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
                </View>
              ))}
            </View>

            {safeAwards.length ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Giải thưởng</Text>
                {safeAwards.map((award, index) => (
                  <View key={award?.id || `award-${index}`} style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: 700 }}>{award?.title || ""}</Text>
                    <Text>{award?.issuer || ""}</Text>
                    <Text style={styles.timeline}>{award?.year || ""}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>

          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kỹ năng</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {safeSkills.map((skill, index) => (
                  <Text key={skill?.id || `skill-${index}`} style={styles.pill}>
                    {skill?.name || skill}
                  </Text>
                ))}
              </View>
            </View>

            {safeLanguages.length ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ngôn ngữ</Text>
                {safeLanguages.map((lang, index) => (
                  <Text key={lang?.id || `lang-${index}`} style={{ marginBottom: 6 }}>
                    {lang?.name || ""}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MinimalTemplate;
