export default function AdminHome() {
  return <p>Перенаправляю...</p>;
}

export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: false,
      destination: '/admin/tasks',
    },
  };
};
