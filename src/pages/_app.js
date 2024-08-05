// import node module libraries
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../pages/authentication/AuthContext';
import { NextSeo } from 'next-seo';
import SSRProvider from 'react-bootstrap/SSRProvider';
import SignIn from '../pages/authentication/sign-in';
import '../styles/theme.scss';
import DefaultDashboardLayout from '../../layouts/DefaultDashboardLayout';
import User from '../../layouts/User';
import index from '.';

function MyApp({ Component, pageProps }){
  const { isAuthenticated } = useAuth();
  const [isAdmin,setIsAdmin] = useState(false)
  const router = useRouter();
  const pageURL = process.env.baseURL + router.pathname;
  const title = "Dash UI - Next.Js Admin Dashboard Template";
  const description = "Dash is a fully responsive and yet modern premium Nextjs template & snippets. Geek is feature-rich Nextjs components and beautifully designed pages that help you create the best possible website and web application projects. Nextjs Snippet "
  const keywords = "Dash UI, Nextjs, Next.js, Course, Sass, landing, Marketing, admin themes, Nextjs admin, Nextjs dashboard, ui kit, web app, multipurpose"

  // useEffect(() => {
  //   if (!isAuthenticated && router.pathname !== '/') {
  //     router.push('/');
  //   } 
  // }, [isAuthenticated]);

  useEffect(()=>{
    if(router.pathname.includes('admin'))
        setIsAdmin(true)
  })

  const Layout = isAdmin ? (isAuthenticated ? (Component.Layout || DefaultDashboardLayout) : SignIn) : index;

  return (
    <SSRProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={keywords} />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <NextSeo
        title={title}
        description={description}
        canonical={pageURL}
        openGraph={{
          url: pageURL,
          title: title,
          description: description,
          site_name: process.env.siteName
        }}
      />
        <Layout>
          <Component {...pageProps} />
          {/* <Analytics /> */}
        </Layout>
    </SSRProvider>
  )
}

// export default MyApp;

export default function AppWrapper(props) {
  return (
    <AuthProvider>
      <MyApp {...props} />
    </AuthProvider>
  );
}
