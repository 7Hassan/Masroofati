const Show = () => {
  const { t } = useTranslation();
  const nav = t('nav', { returnObjects: true });
  const [sec, setSec] = useState('day');

  return (
    <div className="showing">
      <div className="head">
        <Chooser
          setItem={setSec}
          activeItem={sec}
          list={[
            {
              name: 'يوم',
              code: 'day',
            },
            {
              name: 'الاسبوع',
              code: 'week',
            },
            {
              name: 'الشهر',
              code: 'month',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Show;
