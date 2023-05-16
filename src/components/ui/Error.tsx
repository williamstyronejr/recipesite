import Head from 'next/head';
import Link from 'next/link';

const ErrorPage = () => (
  <section className="missing">
    <Head>
      <title>Error - Reshipi Bukku</title>
    </Head>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 792 612"
      className="missing__icon"
    >
      <path
        d="
          M284.375,108.757c-8.689,1.367-17.375,2.965-26.035,4.793c-13.032,2.751-25.988,6.023-38.746,9.802
          C-123.763,225.055,62.315,666.147,395.294,441.109c0.393-0.267,0.781-0.538,1.173-0.805c-0.714-5.852-1.452-11.088-2.276-14.017
          c-1.124-3.996-2.408-3.698-7.949-5.729c-5.542-2.029-15.338-6.387-19.653-8.97s-3.15-3.393,1.15-9.386
          c4.301-5.992,11.735-17.167,15.136-22.95c3.402-5.785,2.769-6.18-1.921-10.096c-4.69-3.915-13.438-11.351-19.373-15.385
          c-5.935-4.033-9.056-4.663-12.68-6.595c-3.625-1.932-7.752-5.167-10.109-12.459c-2.356-7.292-2.943-18.64-2.306-29.663
          c0.639-11.023,2.501-21.722,3.334-26.914c0.833-5.19,0.635-4.875-2.545-6.64c-3.181-1.765-9.342-5.611-15.228-8.843
          c-5.886-3.235-11.495-5.856-14.764-8.006c-3.268-2.151-4.197-3.827-4.914-9.876c-0.717-6.049-1.227-16.47-1.253-21.867
          c-0.026-5.398,0.428-5.774,3.939-13.138s10.077-21.716,12.789-29.907c2.71-8.193,1.566-10.224-4.209-17.673
          c-5.775-7.448-16.181-20.311-21.441-26.999c-5.261-6.688-5.379-7.2-6.047-13.328C285.805,118.718,285.316,114.09,284.375,108.757
          L284.375,108.757z M745.31,421.614c35.922-68.616-18.774-171.146-105.136-248.503c-3.538,4.1-6.814,7.404-9.036,9.66
          c-4.325,4.392-4.648,4.808-6.503,13.112c-1.856,8.305-5.245,24.499-7.364,33.681c-2.12,9.184-2.971,11.355-11.032,14.434
          c-8.062,3.077-23.333,7.063-31.258,8.999s-8.503,1.82-12.668,5.253c-4.166,3.434-11.919,10.415-16.151,14.795
          c-4.233,4.379-4.945,6.159-4.546,10.051c0.401,3.892,1.916,9.896,3.131,16.501c1.216,6.604,2.132,13.81,2.774,17.39
          c0.644,3.578,1.013,3.532-3.535,6.169c-4.549,2.637-14.016,7.957-22.96,14.432s-17.367,14.104-21.525,20.539
          c-4.16,6.436-4.057,11.679-3.263,15.709c0.794,4.029,2.279,6.847,2.906,13.993c0.626,7.149,0.395,18.628,0.326,24.737
          c-0.068,6.108,0.025,6.849-6.606,7.87s-19.99,2.326-27.352,2.782s-8.727,0.065-7.999,5.042c0.727,4.977,3.544,15.322,5.474,20.898
          s2.972,6.384,0.587,9.78c-1.749,2.49-5.339,6.372-9.421,10.625C574.945,505.517,706.507,495.732,745.31,421.614z"
      />
    </svg>
    <h3 className="missing__heading">404</h3>

    <p className="missing__text">
      Sorry, an error occurred on our servers, please try going back to the home
      page.{' '}
      <Link className="missing__link" href="/">
        Click here to go back home.
      </Link>
    </p>
  </section>
);

export default ErrorPage;
