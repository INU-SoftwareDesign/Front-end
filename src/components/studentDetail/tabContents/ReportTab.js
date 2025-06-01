import React, { useRef, useState, useEffect, forwardRef } from 'react';
import styled from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import { useParams } from 'react-router-dom';
import { useReportStore } from '../../../stores/useReportStore';
import { getStudentById } from '../../../api/studentApi';
import PersonalInfo from '../report/PersonalInfo';
import GradeSection from '../report/GradeSection';
import AttendanceSection from '../report/AttendanceSection';
import SpecialNoteSection from '../report/SpecialNoteSection';
import FeedbackSection from '../report/FeedbackSection';

const PrintContent = forwardRef(({ reportData, studentId }, ref) => (
  <PrintableContent ref={ref}>
    <PersonalInfo data={reportData?.personalInfo} />
    <GradeSection data={reportData?.grades} studentId={studentId} />
    <AttendanceSection data={reportData?.attendance} studentId={studentId} />
    <SpecialNoteSection studentId={studentId} />
    <FeedbackSection studentId={studentId} />
  </PrintableContent>
));

const ReportTab = () => {
  const { id: studentId } = useParams();
  const componentRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { reportData, setReportData, setError } = useReportStore();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const data = await getStudentById(studentId);
        setReportData({ personalInfo: data });
      } catch (error) {
        console.error('Failed to fetch student data:', error);
        setError('학생 정보를 불러오는데 실패했습니다.');
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId, setReportData, setError]);

  // Debug: Monitor ref and data changes
  useEffect(() => {
    console.log('ReportTab render state:', {
      componentRef: componentRef.current,
      hasRef: !!componentRef.current,
      refType: componentRef.current?.constructor?.name,
      reportData: !!reportData,
      reportDataKeys: reportData ? Object.keys(reportData) : []
    });
  }, [componentRef, reportData]);

  useEffect(() => {
    if (componentRef.current && reportData) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [componentRef, reportData]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      
      @media print {
        html, body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .page-break {
          page-break-after: always;
          break-after: page;
        }
        
        section {
          page-break-inside: avoid;
          break-inside: avoid;
          margin-bottom: 15mm;
        }
      }
    `,
    onPrintError: (error) => {
      console.error('[handlePrint] Print error:', error);
      setIsPrinting(false);
    },
    onBeforeGetContent: () => {
      console.log('[handlePrint] Before get content:', {
        isPrinting,
        hasRef: !!componentRef.current,
        refType: componentRef.current?.constructor?.name,
        hasData: !!reportData,
        reportDataKeys: reportData ? Object.keys(reportData) : [],
        contentHTML: componentRef.current?.innerHTML?.slice(0, 100) + '...'
      });

      return new Promise((resolve) => {
        setIsPrinting(true);

        if (!reportData || !componentRef.current) {
          console.error('[handlePrint] Content not ready:', {
            hasData: !!reportData,
            hasRef: !!componentRef.current,
            reportDataKeys: reportData ? Object.keys(reportData) : [],
            printRefDetails: {
              type: componentRef.current?.constructor?.name,
              parentNode: componentRef.current?.parentNode?.tagName,
              childNodes: componentRef.current?.childNodes?.length
            }
          });
          setIsPrinting(false);
          resolve(false);
          return;
        }

        // 인쇄 준비 시간 확보
        setTimeout(() => {
          resolve(true);
        }, 500);
      });
    },
    onPrintError: (error) => {
      console.error('[handlePrint] Print error:', {
        error,
        ref: componentRef.current,
        hasRef: !!componentRef.current,
        refType: componentRef.current?.constructor?.name
      });
      setIsPrinting(false);
    },
    onAfterPrint: () => {
      console.log('[handlePrint] After print:', {
        ref: componentRef.current,
        hasRef: !!componentRef.current
      });
      setIsPrinting(false);
    },
    removeAfterPrint: true
  });

  const onPrintClick = () => {
    if (!isReady || !reportData) {
      console.error('Component is not ready for printing');
      return;
    }

    handlePrint();
  };

  return (
    <Container>
      <ControlPanel>
        <PrintButton 
          onClick={onPrintClick}
          disabled={!isReady || isPrinting}
        >
          {isPrinting ? '인쇄 중...' : isReady ? 'PDF로 저장' : '준비 중...'}
        </PrintButton>
      </ControlPanel>

      <ReportContainer>
        <PrintContent ref={componentRef} reportData={reportData} studentId={studentId} />
      </ReportContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const ReportContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const PrintableContent = styled.div`
  width: 210mm;
  min-height: 297mm;
  padding: 20mm 10mm;
  margin: 10mm auto;
  border: 1px solid #d3d3d3;
  border-radius: 5px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;

  /* 각 섹션에 페이지 브레이크 힌트 추가 */
  & > section {
    page-break-inside: avoid;
    break-inside: avoid;
    margin-bottom: 15mm;
  }

  @media print {
    width: 210mm;
    height: auto; /* 자동 높이 설정 */
    margin: 0;
    padding: 20mm 10mm;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }

  @page {
    size: A4;
    margin: 20mm 10mm; /* 좌우 여백 초안 */
  }
`;

const ControlPanel = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
`;

const PrintButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: white;
  cursor: pointer;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #218838;
  }
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: #666;
`;


export default ReportTab;
