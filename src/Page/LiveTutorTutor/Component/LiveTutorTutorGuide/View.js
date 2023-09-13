import React from "react";
import { FormattedMessage } from "react-intl";

import "./index.scss";
import downloadActiveImage from "../../../../Image/ic-download-normal.svg";
import downloadInActiveImage from "../../../../Image/ic-download-dim.svg";

function View(props) {
  const { guideData, regularClassData, quizData } = props;
  return (
    <div className="LiveTutorTutor__Guide">
      <Guide guideData={guideData} />
      <RegularClass regularClassData={regularClassData} quizData={quizData} />
    </div>
  );
}

export default View;

function Guide(props) {
  const { guideData } = props;

  return (
    <div className="Guide">
      <div className="Guide__Inner">
        <p className="Guide--title">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_GUIDE" />
        </p>
        <ul className="Guide__List">
          {guideData &&
            guideData.map((guide, index) => {
              return (
                <li key={index}>
                  <div className="Guide__List--item">
                    <p>{guide.title}</p>
                    <a href={guide.lectureMaterial} target="_blank" rel="noopener noreferrer">
                      {guide.lectureMaterial && (
                        <img
                          className="Guide__List--icon"
                          src={downloadActiveImage}
                          alt="download btn"
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      )}
                    </a>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

function RegularClass(props) {
  const { regularClassData, quizData } = props;
  // 차시별 데이터
  const levelSpecificData = {};
  if (regularClassData) {
    regularClassData.forEach((element) => {
      const { lectureMaterial, lectureLevel } = element;

      if (!levelSpecificData[lectureLevel]) {
        levelSpecificData[lectureLevel] = [];
      }
      levelSpecificData[lectureLevel].push(lectureMaterial);
    });

    if (quizData) {
      quizData.forEach((element) => {
        const { level, materialUrl } = element;

        if (materialUrl && levelSpecificData[level]) {
          levelSpecificData[level].push(materialUrl);
        }
      });
    }
  }

  return (
    <div className="RegularClass">
      <div className="RegularClass__Inner">
        <p className="RegularClass--title">정규수업</p>

        <table className="RegularClass__Table">
          <thead>
            <tr>
              {["강사지도서", 1, 2, 3, 4, "단계테스트 정답"].map((element, index) => {
                return <th key={index}>{index === 5 || index === 0 ? element : `${element}차시`}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {regularClassData &&
              Object.keys(levelSpecificData).map((key, index) => {
                return (
                  <tr key={index}>
                    <td>{key}세트</td>

                    {levelSpecificData[key].map((element, index) => {
                      const isIconActive = element !== null;

                      return (
                        <td key={index}>
                          {element !== "" && (
                            <a href={element} target="_blank" rel="noopener noreferrer">
                              <img
                                className="RegularClass__Table--icon"
                                src={isIconActive ? downloadActiveImage : downloadInActiveImage}
                                alt="download btn"
                                style={
                                  isIconActive
                                    ? {
                                        cursor: "pointer",
                                      }
                                    : {}
                                }
                              />
                            </a>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
