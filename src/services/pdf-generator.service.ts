import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import type { Inspection, Asset } from '@/types'

interface PDFGeneratorOptions {
  inspection: Inspection
  asset: Asset
  technicianName: string
}

export class PDFGeneratorService {
  private doc: jsPDF
  
  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })
  }

  /**
   * Generar PDF completo de inspección
   */
  async generateInspectionPDF(options: PDFGeneratorOptions): Promise<void> {
    const { inspection, asset, technicianName } = options
    
    // Configurar fuente
    this.doc.setFont('helvetica')
    
    // Agregar logo
    await this.addLogo()
    
    // Encabezado
    this.addHeader(inspection)
    
    // Información del cliente y motor
    this.addClientInfo(asset, inspection)
    
    // Tabla de inspección del motor
    this.addMotorInspectionTable(inspection)
    
    // Tabla de inspección del alternador
    this.addAlternatorInspectionTable(inspection)
    
    // Datos de prueba
    this.addTestData(inspection)
    
    // Cuadro eléctrico
    this.addElectricalPanel(inspection)
    
    // Observaciones
    this.addObservations(inspection)
    
    // Firma
    if (inspection.firmaTecnico) {
      this.addSignature(inspection.firmaTecnico, technicianName)
    }
    
    // Descargar PDF
    const fileName = `${inspection.numeroInspeccion || 'Inspeccion'}_${asset.codigo}.pdf`
    this.doc.save(fileName)
  }

  /**
   * Agregar logo de Energy Engine
   */
  private async addLogo(): Promise<void> {
    try {
      // Cargar logo desde public
      const logoUrl = '/logo-energy-engine.png'
      const img = new Image()
      img.src = logoUrl
      
      await new Promise((resolve) => {
        img.onload = () => {
          this.doc.addImage(img, 'PNG', 15, 10, 40, 20)
          resolve(true)
        }
        img.onerror = () => resolve(false)
      })
    } catch (error) {
      console.error('Error cargando logo:', error)
    }
  }

  /**
   * Encabezado del documento
   */
  private addHeader(inspection: Inspection): void {
    const currentYear = new Date().getFullYear()
    const inspectionNumber = inspection.numeroInspeccion || `R - ${currentYear}0001`
    
    // Título principal
    this.doc.setFontSize(28)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('REVISIONES', 105, 25, { align: 'center' })
    
    // Número de inspección
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('Nº INSPECCIÓN:', 70, 35)
    
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(inspectionNumber, 110, 35)
    
    // Línea separadora
    this.doc.setLineWidth(0.5)
    this.doc.line(15, 40, 195, 40)
  }

  /**
   * Información del cliente y motor
   */
  private addClientInfo(asset: Asset, inspection: Inspection): void {
    let yPos = 50
    
    // Cliente
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('CLIENTE:', 20, yPos)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(asset.cliente || 'N/A', 60, yPos)
    
    yPos += 8
    
    // Motor
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('MOTOR:', 20, yPos)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(asset.motorModelo || 'N/A', 60, yPos)
    
    // Potencia
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('POTENCIA:', 130, yPos)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(asset.motorPotencia || 'N/A', 160, yPos)
    
    yPos += 8
    
    // Modelo
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('MODELO:', 20, yPos)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(asset.motorModelo || 'N/A', 60, yPos)
    
    yPos += 8
    
    // Nº Motor
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Nº MOTOR:', 20, yPos)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(asset.motorSerial || 'N/A', 60, yPos)
    
    yPos += 8
    
    // Nº Grupo
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Nº GRUPO:', 20, yPos)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(asset.codigo || 'N/A', 60, yPos)
    
    yPos += 8
    
    // Instalación
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('INSTALACIÓN:', 20, yPos)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(asset.instalacion || 'N/A', 60, yPos)
    
    yPos += 8
    
    // Dirección
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('DIRECCIÓN:', 20, yPos)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(asset.direccion || 'N/A', 60, yPos)
  }

  /**
   * Tabla de inspección del motor
   */
  private addMotorInspectionTable(inspection: Inspection): void {
    const checkMark = (status: string | null | undefined) => {
      if (status === 'OK') return '✓'
      if (status === 'Defectuoso') return '✗'
      if (status === 'Cambio') return '⚠'
      return ''
    }

    const tableData = [
      ['INSPECCIÓN EN EL MOTOR', 'OK', 'DEFECTUOSO', 'CAMBIO'],
      ['Nivel de lubricante', 
        checkMark(inspection.nivelLubricante), 
        inspection.nivelLubricante === 'Defectuoso' ? '✗' : '',
        inspection.nivelLubricante === 'Cambio' ? '✗' : ''
      ],
      ['Indicador nivel refrigerante', 
        checkMark(inspection.nivelRefrigerante),
        inspection.nivelRefrigerante === 'Defectuoso' ? '✗' : '',
        inspection.nivelRefrigerante === 'Cambio' ? '✗' : ''
      ],
      ['Correa del ventilador', 
        checkMark(inspection.correaVentilador),
        inspection.correaVentilador === 'Defectuoso' ? '✗' : '',
        inspection.correaVentilador === 'Cambio' ? '✗' : ''
      ],
      ['Filtro de combustible y prefiltro', 
        checkMark(inspection.filtroCombustible),
        inspection.filtroCombustible === 'Defectuoso' ? '✗' : '',
        inspection.filtroCombustible === 'Cambio' ? '✗' : ''
      ],
      ['Filtro de aire', 
        checkMark(inspection.filtroAire),
        inspection.filtroAire === 'Defectuoso' ? '✗' : '',
        inspection.filtroAire === 'Cambio' ? '✗' : ''
      ],
      ['Filtro de aceite y prefiltro', 
        checkMark(inspection.filtroAceite),
        inspection.filtroAceite === 'Defectuoso' ? '✗' : '',
        inspection.filtroAceite === 'Cambio' ? '✗' : ''
      ],
      ['Tubo de escape', 
        checkMark(inspection.tuboEscape),
        inspection.tuboEscape === 'Defectuoso' ? '✗' : '',
        inspection.tuboEscape === 'Cambio' ? '✗' : ''
      ],
    ]

    autoTable(this.doc, {
      startY: 110,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [16, 185, 129], // Verde Energy Engine
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 40, halign: 'center' },
        3: { cellWidth: 30, halign: 'center' },
      },
      margin: { left: 15, right: 15 },
    })
  }

  /**
   * Tabla de inspección del alternador
   */
  private addAlternatorInspectionTable(inspection: Inspection): void {
    // Obtener la posición Y después de la tabla anterior
    const previousTable = (this.doc as any).lastAutoTable
    const startY = previousTable ? previousTable.finalY + 10 : 170

    const tableData = [
      ['INSPECCIÓN EN EL ALTERNADOR', 'OK', 'DEFECTUOSO', 'CAMBIO'],
      ['Estado general', '✓', '', ''],
      ['Conexiones eléctricas', '✓', '', ''],
      ['Rodamientos', '✓', '', ''],
    ]

    autoTable(this.doc, {
      startY,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 40, halign: 'center' },
        3: { cellWidth: 30, halign: 'center' },
      },
      margin: { left: 15, right: 15 },
    })
  }

  /**
   * Datos de prueba del motor
   */
  private addTestData(inspection: Inspection): void {
    const previousTable = (this.doc as any).lastAutoTable
    const startY = previousTable ? previousTable.finalY + 10 : 200

    const tableData = [
      ['DATOS DE PRUEBA', 'VALOR'],
      ['Horas del motor', `${inspection.horasMotor || 0} h`],
      ['Presión de aceite', `${inspection.presionAceite || 0} bar`],
      ['Temperatura bloque', `${inspection.temperaturaBloque || 0} °C`],
      ['Nivel combustible', `${inspection.nivelCombustible || 0} %`],
    ]

    autoTable(this.doc, {
      startY,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'striped',
      headStyles: {
        fillColor: [245, 158, 11], // Ámbar Energy Engine
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 80, halign: 'center' },
      },
      margin: { left: 15, right: 15 },
    })
  }

  /**
   * Cuadro eléctrico
   */
  private addElectricalPanel(inspection: Inspection): void {
    const previousTable = (this.doc as any).lastAutoTable
    const startY = previousTable ? previousTable.finalY + 10 : 230

    const tableData = [
      ['CUADRO ELÉCTRICO', 'VALOR'],
      ['Tensión', `${inspection.tension || 0} V`],
      ['Frecuencia', `${inspection.frecuencia || 0} Hz`],
      ['Corriente Fase R', `${inspection.corrienteFaseR || 'N/A'} A`],
      ['Corriente Fase S', `${inspection.corrienteFaseS || 'N/A'} A`],
      ['Corriente Fase T', `${inspection.corrienteFaseT || 'N/A'} A`],
    ]

    autoTable(this.doc, {
      startY,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246], // Azul
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 80, halign: 'center' },
      },
      margin: { left: 15, right: 15 },
    })
  }

  /**
   * Observaciones
   */
  private addObservations(inspection: Inspection): void {
    const previousTable = (this.doc as any).lastAutoTable
    let yPos = previousTable ? previousTable.finalY + 15 : 260

    if (inspection.observaciones) {
      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text('OBSERVACIONES:', 15, yPos)
      
      yPos += 7
      
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(9)
      
      const lines = this.doc.splitTextToSize(inspection.observaciones, 180)
      this.doc.text(lines, 15, yPos)
    }
  }

  /**
   * Agregar firma
   */
  private addSignature(signatureBase64: string, technicianName: string): void {
    const pageHeight = this.doc.internal.pageSize.height
    const yPos = pageHeight - 50

    // Título
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('FIRMA DEL TÉCNICO:', 15, yPos)

    // Firma (imagen base64)
    try {
      this.doc.addImage(signatureBase64, 'PNG', 15, yPos + 5, 60, 25)
    } catch (error) {
      console.error('Error agregando firma:', error)
    }

    // Nombre del técnico
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(9)
    this.doc.text(technicianName, 15, yPos + 35)
    this.doc.line(15, yPos + 33, 75, yPos + 33)

    // Fecha
    const fecha = format(new Date(), 'dd/MM/yyyy')
    this.doc.text(`Fecha: ${fecha}`, 120, yPos + 35)
  }
}

// Exportar función helper
export const generateInspectionPDF = async (options: PDFGeneratorOptions) => {
  const generator = new PDFGeneratorService()
  await generator.generateInspectionPDF(options)
}
