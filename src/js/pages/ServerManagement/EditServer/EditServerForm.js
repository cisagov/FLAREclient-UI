import React from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import {addServer, updateServer} from '../../../redux/actions/servers';
import { Spinner } from '../../../utils/Spinner';

const basicAuthRequired = [
  {
    option: true,
    name: 'True'
  },
  {
    option: false,
    name: 'False'
  },
];

const useStyles = makeStyles(() => ({
  root: {},
  editor: {
    '& .ql-editor': {
      height: 400
    }
  }
}));

function EditServerForm({ className, server, ...rest }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  let addOrUpdate="update";
  if (!server) {
    server = {};
    addOrUpdate="add";
  }

  const requiresBasicAuth = server.requiresBasicAuth?'true':'false';
  const serverDescription = server.serverDescription || '';
  const url = server.url || '';
  const label = server.label || '';
  const username = server.username || '';
  const password = server.password ? '********' : '';
  const { enqueueSnackbar } = useSnackbar();
  const originalLabel = server.label;

  return (
    <Formik
      initialValues={{
        requiresBasicAuth: requiresBasicAuth,
        serverDescription: serverDescription,
        url: url,
        label: label,
        username: username,
        password: password
      }}
      validationSchema={Yup.object().shape({
        requiresBasicAuth: Yup.bool(),
        serverDescription: Yup.string().max(5000),
        url: Yup.string().max(255).required(),
        label: Yup.string().max(255).required(),
        username: Yup.string().max(255),
        password: Yup.string().max(255)
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          if (addOrUpdate==='add') {
            await dispatch(addServer(values));
          } else {
            let values2=JSON.parse(JSON.stringify(values));
            // If password has not been changed, then don't sent username/password
            if (values2.password==='********') {
              values2.username='';
              values2.password='';
            }
            await dispatch(updateServer(originalLabel, {...server, ...values2}))
          }

          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar((addOrUpdate==='add')?'Server Added':'Server Updated', {
            variant: 'success'
          });
          history.push('/app/management/servers');
        } catch (err) {
          enqueueSnackbar('Failed to '+((addOrUpdate==='add')?'Add':'Update')+' Server');
          setErrors({ submit: err.message });
          setStatus({ success: false });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }) => (
        <form
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              lg={8}
            >
              <Card>
                <CardContent>
                  <TextField
                      id="server_label"
                      error={Boolean(touched.label && errors.label)}
                      fullWidth
                      helperText={touched.label && errors.label}
                      label="Server Label"
                      name="label"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.label}
                      variant="outlined"
                  />
                  <Box
                      mt={3}
                      mb={1}
                  >
                    <TextField
                        id="discovery_url"
                        error={Boolean(touched.url && errors.url)}
                        fullWidth
                        helperText={touched.url && errors.url}
                        label="Discovery URL"
                        name="url"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.url}
                        variant="outlined"
                    />
                  </Box>

                  <Box
                      mt={3}
                      mb={1}
                  >
                    <TextField
                      id="description"
                      fullWidth
                      label="Description"
                      name="serverDescription"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.serverDescription || ''}
                      variant="outlined"
                      multiline = {true}
                      rows = {5}
                      rowsMax = {10}
                    />
                  </Box>
                  {(touched.serverDescription && errors.serverDescription) && (
                    <Box mt={2}>
                      <FormHelperText error>
                        {errors.serverDescription}
                      </FormHelperText>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
              lg={4}
            >
              <Card>
                <CardHeader title="Authorization" />
                <Divider />
                <CardContent>
                  <TextField
                    id="auth_required"
                    fullWidth
                    label="HTTP Basic Auth Required"
                    name="requiresBasicAuth"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={values.requiresBasicAuth}
                    variant="outlined"
                  >
                    {basicAuthRequired.map((requiresBasicAuth) => (
                      <option
                        key={requiresBasicAuth.option}
                        value={requiresBasicAuth.option}
                      >
                        {requiresBasicAuth.name}
                      </option>
                    ))}
                  </TextField>
                  {values.requiresBasicAuth === 'true' &&
                  <div>
                    <Box mt={2}>
                      <TextField
                          id="username"
                          error={Boolean(touched.username && errors.username)}
                          fullWidth
                          helperText={touched.username && errors.username}
                          label="Username"
                          name="username"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.username}
                          variant="outlined"
                      />
                    </Box>
                    <Box mt={2}>
                      <TextField
                          id="password"
                          error={Boolean(touched.password && errors.password)}
                          fullWidth
                          helperText={touched.password && errors.password}
                          label="Password"
                          name="password"
                          type="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.password}
                          variant="outlined"
                      />
                    </Box>
                  </div>}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              id="add_server"
              color="secondary"
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              {(addOrUpdate==='add')?'Add server':'Update server'}
              {isSubmitting?<Spinner/>:''}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
}

EditServerForm.propTypes = {
  className: PropTypes.string,
  server: PropTypes.object
};

export default EditServerForm;
