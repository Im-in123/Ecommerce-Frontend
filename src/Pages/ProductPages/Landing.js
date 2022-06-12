import React from "react";
import "../../css/product-css/landing.css";
import chair from "../../assets/slide/chair.png";
import bed from "../../assets/slide/bed.jpg";
import lamp from "../../assets/slide/lamp.jpg";
import plant from "../../assets/slide/plant.jpg";
import sofa from "../../assets/slide/sofa.jpg";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <>
      {/* // <!--HEADER--> */}
      {/* <header>
        <section>
          <span>
            <a href="emailto:support@websitename.com">
              Support@websitename.com
            </a>
          </span>
        </section>
        <section>
          <span>
            <a href="#">
              <i className="fa fa-facebook"></i>
            </a>
          </span>
          <span>
            <a href="#">
              <i className="fa fa-instagram"></i>
            </a>
          </span>
          <span>
            <a href="#">
              <i className="fa fa-youtube"></i>
            </a>
          </span>
          <span>
            <a href="#">
              <i className="fa fa-twitter"></i>
            </a>
          </span>
        </section>
      </header> */}

      {/* // <!--NAVIGATION--> */}
      {/* <Header /> */}

      {/* <!--MAIN--> */}
      <main>
        <section>
          {/* <em>Health friendly</em> */}
          <h1 className="title">
            We like to think of our Furniture and Decor as full sensory
            experiences!
          </h1>
          <Link className="btn1" to={`/list/`}>
            Start Shopping!
          </Link>
        </section>
      </main>

      {/* <!--SECTION1--> */}
      <div className="section1">
        <div className="slider">
          <div className="slide-track">
            <div className="slide">
              <img src={chair} height="60" alt="chair" />
            </div>

            <div className="slide">
              <img src={lamp} height="60" alt="lamp" />
            </div>
            <div className="slide">
              <img src={bed} height="60" alt="bed" />
            </div>
            <div className="slide">
              <img src={plant} height="60" alt="plant" />
            </div>
            <div className="slide">
              <img src={sofa} height="60" alt="sofa" />
            </div>
            <div className="slide">
              <img
                src="https://i.postimg.cc/ZnrLHtvj/icon-7.png"
                height="60"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      {/* <!--SECTION2--> */}
      <div className="section2">
        <section>
          <em>Category</em>
          <h1 className="title">Shop by Categories</h1>
          <p>
            We have amazing furnishing and decoration for you to choose,
            categories including office, festivities, etc...
          </p>
        </section>
        <section>
          <span>
            <img
              // src="https://dexterandmason.com/wp-content/uploads/2018/11/Spiced-orange-01.jpg"
              src="https://cdn.shopify.com/s/files/1/0726/2417/files/A_guide_to_buying_the_best_sented_candles_online.jpg?v=1476615293"
              // src="https://www.ellementry.com/blog/wp-content/uploads/2021/01/B-35.jpg"
              alt=""
              loading="lazy"
            />
            <p>Self Discovery</p>
          </span>
          <span>
            <img
              // src="https://i.postimg.cc/4ytW0Hq6/card-2.jpg"
              // src="https://m.media-amazon.com/images/I/71hMBgK-U7L._AC_SX466_.jpg"
              src="https://miro.medium.com/max/3150/2*wG9ONfTJycrFPfHHyK_Mkg.jpeg"
              alt=""
              loading="lazy"
            />
            <p>Accessories</p>
          </span>
          <span>
            <img
              // src="https://i.postimg.cc/2SC0H6wW/card-3.jpg"
              src="https://cdn.shopify.com/s/files/1/0582/6982/7244/products/EEI-739-BEI-SET_8.jpg?v=1639683462"
              alt=""
              loading="lazy"
            />
            <p>Outdoor</p>
          </span>
        </section>
      </div>
      {/* <!--SECTION 2.1--> */}
      {/* <div classNmae="section2.5">
<section></section>
</div> */}

      {/* <!--SECTION3--> */}
      <div className="section3">
        <section>
          <figure>
            <img
              // src="https://i.postimg.cc/W1SXxvWH/01.jpg"
              src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/christmas-tree-decorated-1632519462.jpg?crop=0.564xw:1.00xh;0.147xw,0&resize=640:*"
              alt=""
              loading="lazy"
            />
          </figure>
        </section>
        <section>
          <span>
            <em>About Us</em>
            <h1 className="title">
              We like to think of our wares as full sensory experiences!
            </h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco.
            </p>
            <p>
              Laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit.
            </p>
            <a href="#" className="btn1">
              Contact Us
            </a>
          </span>
        </section>
      </div>

      {/* <!--SECTION4--> */}
      <div className="section4">
        <section>
          <span>
            <em>Shop now</em>
            <h1 className="title">Shop the Holiday or Festive Category </h1>
            <p>
              Decorate your home these coming holidays or gift a loved one with
              our quality festive decor and accessories.
            </p>
          </span>
        </section>
        <section>
          <figure>
            <img
              // src="https://i.postimg.cc/bNx6HbQ8/02.jpg"
              src="https://www.tasteofhome.com/wp-content/uploads/2022/02/Alabaster-Eggs-ecomm-via-williamssonoma.com_.jpg"
              alt=""
              loading="lazy"
            />
          </figure>
        </section>
      </div>

      {/* <!--SECTION5--> */}
      <div className="section5">
        <section>
          <figure>
            <img
              // src="https://i.postimg.cc/wTQVszpj/03.jpg"
              src="https://sc04.alicdn.com/kf/HTB17PLwaLjsK1Rjy1Xaq6zispXaC.jpg"
              alt=""
              loading="lazy"
            />
          </figure>
        </section>
        <section>
          <span>
            <h1 className="title">
              Get office furniture and products from our Office Collection{" "}
            </h1>
          </span>
        </section>
      </div>

      {/* <!--SECTION6--> */}
      <div className="section6">
        <section>
          <span>
            <img src="https://i.postimg.cc/tJ05FCJY/icon-4.png" alt="" />
            <p>(+x) xxxx xxxxx</p>
          </span>
          <span>
            <img src="https://i.postimg.cc/bvBLNRj0/icon-5.png" alt="" />
            <p>support@websitename.com</p>
          </span>
          <span>
            <img src="https://i.postimg.cc/B6Pp81qr/icon-6.png" alt="" />
            <p>
              0th Floor Auricle Building Levioosa Road
              <br /> P.O Box 0000 - 00000 Province - Country
            </p>
          </span>
        </section>
      </div>

      {/* <!--REMOVE THIS--> */}
      <div className="credits">
        <b>Credits:</b>
        <a
          href="https://postimg.cc"
          title="Publish Your Images"
          target="_blank"
        >
          PostImages
        </a>{" "}
        ,
        <a href="https://www.flaticon.com" title="Cool Icons" target="_blank">
          Flaticons
        </a>{" "}
        ,
        <a
          href="https://unsplash.com"
          title="Noncopyright Images"
          target="_blank"
        >
          Unsplash
        </a>
      </div>
    </>
  );
};

export default Landing;
