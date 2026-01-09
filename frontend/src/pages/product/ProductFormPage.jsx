import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { handleInputWholeNumber } from '../../utils/common/inputHelpers';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchProductById, createProduct, updateProduct } from '../../redux/product/productThunk';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedProduct, removeMediaFromProduct } from '../../redux/product/productSlice';
import { ROUTES } from '../../routes/routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

import MediaUploader from '../../components/media/MediaUploader';
import CustomInput from '../../components/common/CustomInput';
import {
  validateProductName,
  validateQuantity,
  validatePrice,
} from '../../utils/validation/commonValidation';

const ProductFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // undefined for add, numeric for edit

  // state
  const { product } = useSelector((state) => state.products);
  const [errMsg, setErrMsg] = useState('');
  const [files, setFiles] = useState(null);

  // Handle media deletion
  const handleMediaDeleted = (mediaId) => {
    // Remove media from product state in Redux
    dispatch(removeMediaFromProduct(mediaId));
  };

  // Handling form data here.
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      qty: '',
      price: '',
      files: null,
    },
  });

  // check the error validation using react hook form
  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) setFocus(firstError);
  }, [errors, setFocus]);

  // fetching product for editing
  useEffect(() => {
    if (!id) {
      dispatch(clearSelectedProduct());

      reset({
        name: '',
        description: '',
        qty: '',
        price: '',
      });
    } else {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch, reset]);

  // if the product is present then it and edit form
  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        description: product.description || '',
        qty: product.qty || '',
        price: product.price || '',
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    setErrMsg('');

    const formData = new FormData();

    // Append react-hook-form normal fields
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // ✅ FIX: Extract the actual File object from each wrapper object
    if (files && files.length > 0) {
      files.forEach((fileObj) => {
        // fileObj.file is the actual File object
        formData.append('files', fileObj.file);
      });
    }

    try {
      if (product) {
        await dispatch(updateProduct({ id: product.product_id, formData })).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await dispatch(createProduct(formData)).unwrap();
        toast.success('Product created successfully!');
      }

      // Only runs if API succeeded
      dispatch(clearSelectedProduct());
      navigate(ROUTES.PRODUCT.ROOT);
    } catch (err) {
      setErrMsg(err || 'Something went wrong');
      toast.error(errMsg);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mt: 4,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          mb: 3,
          fontWeight: 600,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ color: 'text.primary' }}
          onClick={() => {
            navigate(ROUTES.PRODUCT.ROOT);
          }}
        ></Button>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          {product ? 'Edit Product' : 'Add New Product'}
        </Typography>
      </Box>

      <Box
        onSubmit={handleSubmit(onSubmit)} // Submit Handler
        component="form"
      >
        <Grid container spacing={3}>
          {/* Full width fields */}
          <Grid item xs={12}>
            <CustomInput
              name="name"
              label="Product Name"
              type="text"
              isRequired={true}
              validation={{
                required: 'Product Name is required',
                validate: validateProductName,
              }}
              register={register}
              errors={errors}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomInput
              name="description"
              label="Description"
              type="text"
              multiline={true}
              rows={3}
              register={register}
              errors={errors}
            />
          </Grid>

          {/* Row 2: Quantity and Price - 2 per row on larger screens */}
          <Grid item xs={12} md={6}>
            <CustomInput
              name="qty"
              label="Quantity"
              type="number"
              isRequired={true}
              min={0}
              step={1}
              validation={{
                required: 'Quantity is required',
                validate: validateQuantity,
              }}
              htmlInput={{
                onKeyDown: handleInputWholeNumber,
              }}
              register={register}
              errors={errors}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomInput
              name="price"
              label="Price"
              type="decimal"
              isRequired={true}
              min={0}
              step={0.01}
              validation={{
                required: 'Price is required',
                validate: validatePrice,
              }}
              register={register}
              errors={errors}
            />
          </Grid>

          {/* Row 3: Media Upload - Full width */}
          <Grid item xs={12}>
            <MediaUploader
              files={files}
              setFiles={setFiles}
              existingMedia={product?.media || []}
              onMediaDeleted={handleMediaDeleted}
              allowedTypes={['image', 'video']}
              limits={{ image: 5, video: 1 }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
            }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={26} />
            ) : product ? (
              'Update Product'
            ) : (
              'Create Product'
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductFormPage;
