const API_URL = process.env.REACT_APP_BASE_URL || '';

export const validateFields = async (fields, data, token) => {

  console.log('Validating fields:', fields, data, token);
  const errors = {};



  for (const field of fields) {
    const value = data[field];

    switch (field) {

     
      // Branch/Role/Other Common Required Fields
      case 'code':
      case 'role_id':
      case 'branch_id':
      case 'name':
      case 'contact_person':
      case 'description':
      case 'first_name':
      case 'father_name':
        if (!value || value.trim() === '') {
          errors[field] = 'This field is required';
        }
        break;

      // Aadhaar validation
      case 'aadhaar':
        if (!value || value.trim() === '') {
          errors[field] = 'This field is required';
        } else if (!/^\d{12}$/.test(value)) {
          errors[field] = 'Aadhaar must be 12 digits';
        }
        break;

      // Gender validation
      case 'gender_id':
        if (!value || value === '') {
          errors[field] = 'Please select gender';
        }
        break;

      // Class validation
      case 'class_type_id':
        if (!value || value === '') {
          errors[field] = 'Please select class';
        }
        break;

      // Mobile validation (with uniqueness check)
      case 'mobile':
        if (!value || value.trim() === '') {
          errors[field] = 'This field is required';
        } else if (!/^\d{10}$/.test(value)) {
          errors[field] = 'Mobile must be 10 digits';
        } else {
          const response = await fetch(
            `${API_URL}/check-unique?mobile=${encodeURIComponent(value)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          const result = await response.json();
          if (result.mobileExists) {
            errors[field] = 'Mobile already exists';
          }
        }
        break;

      // Email validation (with uniqueness check)
      case 'email':
        if (!value || value.trim() === '') {
          errors[field] = 'This field is required';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          errors[field] = 'Invalid email address';
        } else {
          const response = await fetch(
            `${API_URL}/check-unique?email=${encodeURIComponent(value)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          const result = await response.json();
          if (result.emailExists) {
            errors[field] = 'Email already exists';
          }
        }
        break;

      // Pin code validation
      case 'pin_code':
        if (value && !/^\d{6}$/.test(value)) {
          errors[field] = 'Pin code must be 6 digits';
        }
        break;

      // Password validation
      case 'password':
        if (!value || value.trim() === '') {
          errors[field] = 'This field is required';
        } else if (value.length < 6) {
          errors[field] = 'Password must be at least 6 characters';
        }
        break;

      // Username validation (with uniqueness check)
      case 'username':
        if (!value || value.trim() === '') {
          errors[field] = 'This field is required';
        } else {
          const response = await fetch(
            `${API_URL}/check-unique?username=${encodeURIComponent(value)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          const result = await response.json();
          if (result.usernameExists) {
            errors[field] = 'Username already exists';
          }
        }
        break;

      // Date of Birth validation
      case 'dob':
        if (!value || value.trim() === '') {
          errors[field] = 'Date of Birth is required';
        }
        break;

      // File validations (optional, just check if required)
      case 'photo':
      case 'father_img':
      case 'mother_img':
        // If you want to make these required, uncomment below:
        // if (!value) {
        //   errors[field] = 'This field is required';
        // }
        break;

      default:
        break;
    }
  }

  return errors;
};