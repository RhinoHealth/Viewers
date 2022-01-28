window.config = {
  routerBasename: '/',
  showStudyList: true,
  servers: {
    dicomWeb: [
      {
        name: 'Orthanc',
        wadoUriRoot: 'http://localhost:8080/api/v1/wado',
        qidoRoot: 'http://localhost:8080/api/v1/dicom-web',
        wadoRoot: 'http://localhost:8080/api/v1/dicom-web',
        qidoSupportsIncludeField: false,
        imageRendering: 'wadors',
        thumbnailRendering: 'wadors',
      },
    ],
  },
};


