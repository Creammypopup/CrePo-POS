    // client/src/pages/settings/GeneralPage.jsx
    import React, { useState, useEffect } from 'react';
    import { FaSave } from 'react-icons/fa';
    import { toast } from 'react-toastify';
    import { useNavigate } from 'react-router-dom';
    import { useDispatch, useSelector } from 'react-redux';
    import { getSettings, updateSettings, reset } from '../../features/settings/settingSlice';
    import Spinner from '../../components/Spinner';

    function GeneralPage() {
      const navigate = useNavigate();
      const dispatch = useDispatch();

      const { settings, isLoading, isSuccess, isError, message } = useSelector((state) => state.settings);

      const [formData, setFormData] = useState({
        companyName: '',
        address: '',
        phone: '',
        taxId: '',
      });
      const [logoPreview, setLogoPreview] = useState(null);

      useEffect(() => {
        dispatch(getSettings());

        return () => {
            dispatch(reset());
        }
      }, [dispatch]);

      useEffect(() => {
        if (settings) {
            setFormData({
                companyName: settings.companyName || '',
                address: settings.address || '',
                phone: settings.phone || '',
                taxId: settings.taxId || '',
            });
            setLogoPreview(settings.logoUrl || null);
        }
        if (isSuccess) {
            toast.success('บันทึกข้อมูลร้านค้าสำเร็จ!');
        }
        if (isError) {
            toast.error(message);
        }
      }, [settings, isSuccess, isError, message]);


      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleLogoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setLogoPreview(URL.createObjectURL(file));
          // In a real app, you would upload the file and get a URL back
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateSettings(formData));
      };

      if (isLoading && !settings) {
        return <Spinner />;
      }

      return (
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800">ตั้งค่าทั่วไป</h1>
          
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mb-4 overflow-hidden border">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400">โลโก้</span>
                  )}
                </div>
                <label htmlFor="logo-upload" className="btn btn-3d-pastel bg-gray-100 text-gray-700 cursor-pointer">
                  เลือกไฟล์
                </label>
                <input id="logo-upload" type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-600">ชื่อร้านค้า / บริษัท</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="form-input" placeholder="เช่น ร้านครีมมี่ป๊อปวัสดุก่อสร้าง" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-600">เบอร์โทรศัพท์</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" placeholder="08x-xxx-xxxx" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-600">เลขประจำตัวผู้เสียภาษี (ถ้ามี)</label>
                  <input type="text" name="taxId" value={formData.taxId} onChange={handleInputChange} className="form-input" placeholder="เลข 13 หลัก" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-600">ที่อยู่</label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" className="form-input" placeholder="ที่อยู่ที่แสดงบนเอกสาร"></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t mt-6 gap-4">
              <button type="button" onClick={() => navigate('/')} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300">
                ยกเลิก
              </button>
              <button type="submit" className="btn btn-3d-pastel btn-primary flex items-center" disabled={isLoading}>
                {isLoading ? <Spinner small /> : <FaSave className="mr-2" />}
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </form>
        </div>
      );
    }

    export default GeneralPage;
    