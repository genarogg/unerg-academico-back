import viewEJS from './plugin/viewEJS';
import staticFiles from './plugin/staticFiles';
import graphql from './plugin/graphql';
import caching from './plugin/caching';

import rateLimit from './plugin/rateLimit';
import helmet from './plugin/helmet';

import corsFastify from './plugin/corsFastify';
import underPressureFastify from './plugin/underPressureFastify';
import slowDownFastify from './plugin/slowDownFastify';
import compressFastify from './plugin/compressFastify';
import reactView from './plugin/reactView';
import dbConection from './db-conection';
import multipart from './plugin/multipar';



export {
    staticFiles,
    viewEJS,
    graphql,
    caching,
    rateLimit,
    helmet,
    corsFastify,
    underPressureFastify,
    slowDownFastify,
    compressFastify,
    reactView,
    multipart,
    dbConection,
}