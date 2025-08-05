"use client";
import GeneralHero from "@/components/GeneralHero";
import Meta from "@/components/Meta";
import {
  MapPinCustom,
  MessagePhone,
  SingleLineShortLeft,
  SingleLineShortRight,
} from "@/components/shapes";
import StyledButton from "@/components/StyledButton";
import { useTranslation } from "@/contexts/TranslationProvider";
import { useIsMobile } from "@/lib/hooks/useMobile";
import { ContactData } from "@/types/PropTypes";
import clsx from "clsx";
import { useState, ChangeEvent, FormEvent } from "react";

export default function IngridYse342() {
  const sm = useIsMobile(640);
  const { t } = useTranslation();
  const Data: ContactData = t("IngridYse342");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    level: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    whatsapp: '',
    level: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      whatsapp: '',
      level: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
      valid = false;
    } else if (!/^\+?[0-9\s\-]+$/.test(formData.whatsapp)) {
      newErrors.whatsapp = 'Please enter a valid phone number';
      valid = false;
    }

    if (!formData.level) {
      newErrors.level = 'Please select your Spanish level';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/save-form-data/IngridYse342', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formattedDate: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          whatsapp: '',
          level: ''
        });

        // Scroll up after short delay, then hide the "Sending..." message
      setTimeout(() => {
		  document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
		  document.body.scrollTo({ top: 0, behavior: "smooth" });
		  setIsSubmitting(false);
		}, 300);
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting the form. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Meta route="/IngridYse342" />


 <GeneralHero
        icon={
          <MessagePhone
            path={{
              fill: "none",
              stroke: "#FEFEFE",
            }}
          />
        }
        text={Data.PageTitle}
      />


      <section className="w-full px-4 py-10 flex flex-col items-center bg-white">
        <div className="mt-6 text-center max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">
            Just fill the form and claim your discount
          </h2>

          {isSubmitting && (
            <div className="p-2 mb-4 text-blue-700 bg-blue-100 rounded text-center">
              Sending...
            </div>
          )}

          {isSubmitted ? (
            <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
              Your information has been received. We will contact you as soon as possible.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
              <div>
                <label htmlFor="name" className="block text-left mb-1">Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-left mb-1">Email*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-left mb-1">WhatsApp Number*</label>
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+90 555 123 4567"
                  className="w-full p-2 border rounded"
                />
                {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
              </div>

              <div>
                <label htmlFor="level" className="block text-left mb-1">Spanish Level*</label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select your level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="I am not sure">I am not sure</option>
                </select>
                {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="w-full mt-10 bg-white isolate relative grid grid-cols-1 sm:grid-cols-2 items-center justify-center overflow-hidden">
        <div className="w-full h-full isolate px-4 relative py-14 md:px-10 lg:px-20 flex flex-col gap-5">
          <span
            className={clsx(
              "absolute size-full bg-[#DEEBFE] top-0 left-0 -z-10",
              sm ? "contact-shape-bottom" : "contact-shape-left"
            )}
          />
          <span className="absolute h-full -left-2 top-0 pointer-events-none -z-10">
            <SingleLineShortLeft className="h-[calc(100%+2rem)]" />
          </span>
          <strong className="text-lg sm:text-xl lg:text-2xl">
            {Data.needAssistance}
          </strong>
          <p>{Data.contactDescription}</p>
          <div className="w-full mt-2 flex items-center justify-center sm:justify-start">
            <a href={Data.whatsapplink} target="_blank" rel="noopener noreferrer">
              <StyledButton
                icon={
                  <MessagePhone
                    path={{
                      fill: "var(--styledButtonHoveredTextColor)",
                      style: {
                        transitionDuration: "300ms",
                      },
                    }}
                    svg={{
                      className: "size-4",
                    }}
                  />
                }
              >
                {Data.officeContactButton}
              </StyledButton>
            </a>
          </div>
        </div>

        <div className="w-full isolate flex flex-col items-center px-4 relative py-14 md:px-10 lg:px-20 gap-5">
          <span
            className={clsx(
              "absolute size-full bg-[#DEEBFE] top-0 left-0 -z-10",
              sm ? "contact-shape-top" : "contact-shape-right"
            )}
          />
          <span className="absolute h-full right-0 top-0 pointer-events-none -z-10">
            <SingleLineShortRight className="h-[calc(100%+2rem)] translate-x-2 -z-10" />
          </span>
          <span className="size-10">
            <MapPinCustom className="size-full" />
          </span>
          <strong>{Data.officeAddressTitle}</strong>
          <address className="w-full text-center max-w-[25ch]">
            {Data.officeAddressDescription}
          </address>
        </div>
      </section>
    </>
  );
}
