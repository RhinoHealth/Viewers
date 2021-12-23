import React from 'react';
import PropTypes from 'prop-types';
import OHIF, { utils, user } from '@ohif/core';
//
import ConnectedViewerRetrieveStudyData from '../connectedComponents/ConnectedViewerRetrieveStudyData';
import useServer from '../customHooks/useServer';
import useQuery from '../customHooks/useQuery';
const { urlUtil: UrlUtil } = utils;

/**
 * Get array of seriesUIDs from param or from queryString
 * @param {*} seriesInstanceUIDs
 * @param {*} location
 */
const getSeriesInstanceUIDs = (seriesInstanceUIDs, routeLocation) => {
  const queryFilters = UrlUtil.queryString.getQueryFilters(routeLocation);
  const querySeriesUIDs = queryFilters && queryFilters['seriesInstanceUID'];
  const _seriesInstanceUIDs = seriesInstanceUIDs || querySeriesUIDs;

  return UrlUtil.paramString.parseParam(_seriesInstanceUIDs);
};

function ViewerRouting({ match: routeMatch, location: routeLocation }) {
  const {
    project,
    location,
    dataset,
    dicomStore,
    studyInstanceUIDs,
    seriesInstanceUIDs,
  } = routeMatch.params;

  // Set the user's default authToken for outbound DICOMWeb requests.
  // Is only applied if target server does not set `requestOptions` property.
  //
  // See: `getAuthorizationHeaders.js`
  let query = useQuery();
  const authToken = query.get('token');

  /**
   * Gets context via query strings and set custom headers
   * to be sent on every dicomweb-client request.
   *
   * In order for this to work, cors needs to be enabled in the server.
   */
  const cohort_uid = query.get('cohort_uid');
  const secure_access_list_uid = query.get('secure_access_list_uid');
  OHIF.user.setHeaders({
    cohort_uid,
    secure_access_list_uid,
  });
  if (authToken) {
    user.getAccessToken = () => authToken;
  }

  const server = useServer({ project, location, dataset, dicomStore });
  const studyUIDs = UrlUtil.paramString.parseParam(studyInstanceUIDs);
  const seriesUIDs = getSeriesInstanceUIDs(seriesInstanceUIDs, routeLocation);

  if (server && studyUIDs) {
    return (
      <ConnectedViewerRetrieveStudyData
        studyInstanceUIDs={studyUIDs}
        seriesInstanceUIDs={seriesUIDs}
      />
    );
  }

  return null;
}

ViewerRouting.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      studyInstanceUIDs: PropTypes.string.isRequired,
      seriesInstanceUIDs: PropTypes.string,
      dataset: PropTypes.string,
      dicomStore: PropTypes.string,
      location: PropTypes.string,
      project: PropTypes.string,
    }),
  }),
  location: PropTypes.any,
};

export default ViewerRouting;
