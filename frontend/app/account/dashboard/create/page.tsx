import FundraiserPage from './[id]/page';

const AddCampaign = () => {
  return (
    <div>
      <FundraiserPage />
      <div className="w-full bg-white text-center mt-4 h-10 text-gray-300">
        &copy; {new Date().getFullYear()} BantuHive Ltd. All rights reserved.
      </div>
    </div>
  );
};

export default AddCampaign;
