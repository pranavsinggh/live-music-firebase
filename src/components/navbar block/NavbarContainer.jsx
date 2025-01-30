import Logo from "./Logo";
import Menu from "./Menu";

const NavbarContainer = () => {
  return (
    <section className="bg-[#1A243E] h-[70px] sticky top-0 z-[2]">
      <article className="m-auto h-[70px] flex w-[90%] items-center justify-between">
        <Logo />
        <Menu />
      </article>
    </section>
  );
};

export default NavbarContainer;
