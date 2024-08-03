<div>
{isEditing ? (
    <form className="ProfileForm" onSubmit={handleSubmit}>
        <div>
            <h2 className='form-heading'>Edit Profile</h2>
            {Object.keys(formData).map((field) => (
                (field !== 'profileImage') && (
                    <div key={field}>
                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                            type="text"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                        />
                        {errors[field] && <span style={{ color: 'red' }}>{errors[field]}</span>}
                    </div>
                )
            ))}
        </div>
        {/* <div>
            <label>Profile Image</label>
            <input
                type="file"
                name="profileImage"
                onChange={handleFileChange}
            />
            {errors.profileImage && <span style={{ color: 'red' }}>{errors.profileImage}</span>}
        </div> */}
        <button type="submit">Update Profile</button>
        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
    </form>
) : (
    <div>
        <h2 className='form-heading'>Profile Information</h2>
        {Object.keys(formData).map((field) => (
            (field !== 'profileImage') && (
                <div key={field}>
                    <p><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {formData[field] || 'N/A'}</p>
                </div>
            )
        ))}
        <button onClick={handleEditClick}>Edit</button>
    </div>
)}
</div>