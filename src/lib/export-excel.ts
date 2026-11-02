import { LeadRecord } from "./leads-store";

/**
 * Generates an Excel-compatible XML spreadsheet (.xls)
 * which opens natively in Microsoft Excel with styling, borders, and full UTF-8 support.
 */
export function generateExcelWorkbook(leads: LeadRecord[], sheetName = "Contacted Leads"): string {
  const sanitize = (text: string | number | undefined | null) => {
    if (text === undefined || text === null) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const rowsXml = leads
    .map((lead, idx) => {
      const notesSummary = lead.notes && lead.notes.length > 0
        ? lead.notes.map((n) => `[${n.author}]: ${n.content}`).join(" | ")
        : "None";

      const formattedDate = new Date(lead.createdAt).toISOString().split("T")[0];

      return `
      <Row ss:Height="22">
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${sanitize(lead.id)}</Data></Cell>
        <Cell ss:StyleID="BoldDataCell"><Data ss:Type="String">${sanitize(lead.fullName)}</Data></Cell>
        <Cell ss:StyleID="PhoneCell"><Data ss:Type="String">${sanitize(lead.phone)}</Data></Cell>
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${sanitize(lead.email || "N/A")}</Data></Cell>
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${sanitize(lead.region)}</Data></Cell>
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${sanitize(lead.productTitle || "General Machinery")}</Data></Cell>
        <Cell ss:StyleID="NumberCell"><Data ss:Type="Number">${lead.farmSizeHectares || 0}</Data></Cell>
        <Cell ss:StyleID="StatusCell"><Data ss:Type="String">${sanitize(lead.status)}</Data></Cell>
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${sanitize(formattedDate)}</Data></Cell>
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${sanitize(lead.source)}</Data></Cell>
        <Cell ss:StyleID="WrapDataCell"><Data ss:Type="String">${sanitize(lead.message)}</Data></Cell>
        <Cell ss:StyleID="WrapDataCell"><Data ss:Type="String">${sanitize(notesSummary)}</Data></Cell>
      </Row>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#003E6B"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#005B96" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataCell">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="BoldDataCell">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Bold="1" ss:Color="#0F172A"/>
  </Style>
  <Style ss:ID="PhoneCell">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Consolas" ss:Size="9.5" ss:Color="#005B96"/>
  </Style>
  <Style ss:ID="NumberCell">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="StatusCell">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Bold="1" ss:Color="#005B96"/>
   <Interior ss:Color="#F0F7FF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="WrapDataCell">
   <Alignment ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#475569"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${sanitize(sheetName)}">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="80"/>
   <Column ss:Width="160"/>
   <Column ss:Width="130"/>
   <Column ss:Width="180"/>
   <Column ss:Width="150"/>
   <Column ss:Width="220"/>
   <Column ss:Width="90"/>
   <Column ss:Width="100"/>
   <Column ss:Width="90"/>
   <Column ss:Width="160"/>
   <Column ss:Width="300"/>
   <Column ss:Width="300"/>
   <Row ss:Height="26">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Lead ID</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Customer Name</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Telephone</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Email Address</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Region / Location</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Machinery Model</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Farm Size (Ha)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Pipeline Status</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Date Received</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Acquisition Source</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Inquiry Message</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Sales Notes</Data></Cell>
   </Row>
   ${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;
}

/**
 * Generates an Excel-compatible UTF-8 CSV with Byte Order Mark (\uFEFF)
 */
export function generateExcelCSV(leads: LeadRecord[]): string {
  const headers = [
    "Lead ID",
    "Customer Name",
    "Telephone",
    "Email Address",
    "Region / Location",
    "Machinery Model",
    "Farm Size (Ha)",
    "Pipeline Status",
    "Date Received",
    "Acquisition Source",
    "Inquiry Message",
    "Sales Notes",
  ];

  const rows = leads.map((l) => {
    const notesSummary = l.notes && l.notes.length > 0
      ? l.notes.map((n) => `[${n.author}]: ${n.content}`).join(" | ")
      : "";

    return [
      `"${l.id}"`,
      `"${(l.fullName || "").replace(/"/g, '""')}"`,
      `"${(l.phone || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.region || "").replace(/"/g, '""')}"`,
      `"${(l.productTitle || "").replace(/"/g, '""')}"`,
      `"${l.farmSizeHectares || ""}"`,
      `"${l.status}"`,
      `"${new Date(l.createdAt).toLocaleDateString()}"`,
      `"${(l.source || "").replace(/"/g, '""')}"`,
      `"${(l.message || "").replace(/"/g, '""')}"`,
      `"${notesSummary.replace(/"/g, '""')}"`,
    ];
  });

  return "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}
