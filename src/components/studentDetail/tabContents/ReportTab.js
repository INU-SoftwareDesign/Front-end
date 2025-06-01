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

const PrintContent = forwardRef(({ reportData, currentPage, studentId }, ref) => (
  <PrintableContent ref={ref}>
    <PersonalInfo data={reportData?.personalInfo} />
    <GradeSection data={reportData?.grades} studentId={studentId} />
    <AttendanceSection data={reportData?.attendance} studentId={studentId} />
    <SpecialNoteSection studentId={studentId} />
    <FeedbackSection data={reportData?.feedback} />
  </PrintableContent>
));

const ReportTab = () => {
  const { id: studentId } = useParams();
  const componentRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { currentPage, setCurrentPage, totalPages, reportData, setReportData, setError } = useReportStore();

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

        resolve(true);
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

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container>
      <ControlPanel>
        <PageNavigation>
          <NavButton 
            onClick={() => handlePageChange('prev')} 
            disabled={currentPage === 1}
          >
            이전 페이지
          </NavButton>
          <PageInfo>{currentPage} / {totalPages}</PageInfo>
          <NavButton 
            onClick={() => handlePageChange('next')} 
            disabled={currentPage === totalPages}
          >
            다음 페이지
          </NavButton>
        </PageNavigation>
        <PrintButton 
          onClick={onPrintClick}
          disabled={!isReady || isPrinting}
        >
          {isPrinting ? '인쇄 중...' : isReady ? 'PDF로 저장' : '준비 중...'}
        </PrintButton>
      </ControlPanel>

      <ReportContainer>
        <PrintContent ref={componentRef} reportData={reportData} currentPage={currentPage} studentId={studentId} />
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
  padding: 20mm;
  margin: 10mm auto;
  border: 1px solid #d3d3d3;
  border-radius: 5px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media print {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 20mm;
    border: none;
    border-radius: 0;
    box-shadow: none;
    page-break-after: always;
  }

  @page {
    size: A4;
    margin: 0;
  }
`;



const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
`;

const PageNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NavButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
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
